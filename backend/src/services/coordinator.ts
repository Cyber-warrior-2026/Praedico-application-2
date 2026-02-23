import { DepartmentCoordinatorModel, IDepartmentCoordinator } from "../models/departmentCoordinator";
import { UserModel } from "../models/user";
import { DepartmentModel } from "../models/department";
import PortfolioHolding from "../models/portfolio";
import { PaperTradeModel } from "../models/paperTrade";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { ENV } from "../config/env";
import {
  sendCoordinatorInviteEmail,
  sendStudentApprovalEmail,
  sendStudentRejectionEmail
} from "./email";


export class CoordinatorService {

  // Create Coordinator (by Organization Admin)
  async createCoordinator(data: {
    organizationId: string;
    departmentId: string;
    name: string;
    email: string;
    mobile: string;
    designation: 'hod' | 'faculty' | 'coordinator' | 'other';
  }) {
    // Check if email already exists
    const existingCoordinator = await DepartmentCoordinatorModel.findOne({ email: data.email });
    if (existingCoordinator) {
      throw new Error("Coordinator with this email already exists");
    }

    // Verify department belongs to organization
    const department = await DepartmentModel.findOne({
      _id: data.departmentId,
      organization: data.organizationId
    });

    if (!department) {
      throw new Error("Department not found or doesn't belong to this organization");
    }

    const verificationToken = crypto.randomBytes(32).toString("hex");

    const coordinator = await DepartmentCoordinatorModel.create({
      organization: data.organizationId,
      department: data.departmentId,
      name: data.name,
      email: data.email,
      mobile: data.mobile,
      designation: data.designation,
      verificationToken,
      isVerified: false
    });

    // Send invite email
    await sendCoordinatorInviteEmail(data.email, data.name, verificationToken, department.departmentName);

    // Update department stats
    await this.updateDepartmentStats(data.departmentId);

    return {
      message: "Coordinator invited successfully. Verification email sent.",
      coordinatorId: coordinator._id
    };
  }

  // Verify Coordinator Email & Set Password
  async verify(token: string, password: string) {
    const coordinator = await DepartmentCoordinatorModel.findOne({ verificationToken: token })
      .select("+verificationToken");

    if (!coordinator) {
      throw new Error("Invalid or expired verification token");
    }

    const hashedPassword = await argon2.hash(password);

    coordinator.passwordHash = hashedPassword;
    coordinator.isVerified = true;
    coordinator.verificationToken = undefined;
    await coordinator.save();

    const accessToken = this.generateAccessToken(coordinator);
    const refreshToken = this.generateRefreshToken(coordinator);

    return {
      coordinator: this.sanitizeCoordinator(coordinator),
      accessToken,
      refreshToken
    };
  }

  // Login Coordinator
  async login(email: string, password: string) {
    const coordinator = await DepartmentCoordinatorModel.findOne({ email })
      .select("+passwordHash");

    if (!coordinator) {
      throw new Error("Invalid email or password");
    }

    if (!coordinator.isVerified) {
      throw new Error("Please verify your email first");
    }

    if (!coordinator.isActive) {
      throw new Error("Your account has been deactivated");
    }

    if (coordinator.isDeleted) {
      throw new Error("Your account has been removed. Contact organization admin.");
    }

    const isPasswordValid = await argon2.verify(coordinator.passwordHash!, password);
    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    coordinator.lastLogin = new Date();
    coordinator.lastActive = new Date();
    await coordinator.save();

    const accessToken = this.generateAccessToken(coordinator);
    const refreshToken = this.generateRefreshToken(coordinator);

    return {
      coordinator: this.sanitizeCoordinator(coordinator),
      accessToken,
      refreshToken
    };
  }

  // Get Coordinator Profile
  async getCoordinatorById(coordinatorId: string) {
    const coordinator = await DepartmentCoordinatorModel.findById(coordinatorId)
      .populate('organization', 'organizationName')
      .populate('department', 'departmentName departmentCode');

    if (!coordinator) {
      throw new Error("Coordinator not found");
    }

    return this.sanitizeCoordinator(coordinator);
  }

  // Get Students in Coordinator's Department
  async getMyDepartmentStudents(coordinatorId: string, status?: string) {
    const coordinator = await DepartmentCoordinatorModel.findById(coordinatorId);

    if (!coordinator) {
      throw new Error("Coordinator not found");
    }

    const filter: any = {
      department: coordinator.department
    };

    if (status) {
      filter.organizationApprovalStatus = status;
    }

    const students = await UserModel.find(filter)
      .select('-passwordHash')
      .sort({ createdAt: -1 });

    return students;
  }

  // Get Pending Approvals in Department
  async getPendingStudents(coordinatorId: string) {
    const coordinator = await DepartmentCoordinatorModel.findById(coordinatorId);

    if (!coordinator) {
      throw new Error("Coordinator not found");
    }

    const students = await UserModel.find({
      department: coordinator.department,
      organizationApprovalStatus: 'pending',
      isDeleted: false
    }).select('-passwordHash');

    return students;
  }

  // Approve Student
  async approveStudent(coordinatorId: string, studentId: string) {
    const coordinator = await DepartmentCoordinatorModel.findById(coordinatorId);

    if (!coordinator) {
      throw new Error("Coordinator not found");
    }

    const student = await UserModel.findOne({
      _id: studentId,
      department: coordinator.department
    });

    if (!student) {
      throw new Error("Student not found or doesn't belong to your department");
    }

    if (student.organizationApprovalStatus === 'approved') {
      throw new Error("Student is already approved");
    }

    student.organizationApprovalStatus = 'approved';
    student.ApprovedBy = coordinatorId as any;
    student.approvedByType = 'department_coordinator';
    student.ApprovedAt = new Date();
    await student.save();

    // Update department stats
    await this.updateDepartmentStats(coordinator.department.toString());

    // Send approval email
    await sendStudentApprovalEmail(student.email, student.name);

    return { message: "Student approved successfully" };
  }

  // Reject Student
  async rejectStudent(coordinatorId: string, studentId: string, reason?: string) {
    const coordinator = await DepartmentCoordinatorModel.findById(coordinatorId);

    if (!coordinator) {
      throw new Error("Coordinator not found");
    }

    const student = await UserModel.findOne({
      _id: studentId,
      department: coordinator.department
    });

    if (!student) {
      throw new Error("Student not found or doesn't belong to your department");
    }

    student.organizationApprovalStatus = 'rejected';
    student.RejectedReason = reason || 'No reason provided';
    await student.save();

    // Update department stats
    await this.updateDepartmentStats(coordinator.department.toString());

    // Send rejection email
    await sendStudentRejectionEmail(student.email, student.name, reason);

    return { message: "Student rejected" };
  }

  // Add Student Directly (No Approval Needed)
  async addStudentDirectly(coordinatorId: string, studentData: {
    name: string;
    email: string;
  }) {
    // Get coordinator details
    const coordinator = await DepartmentCoordinatorModel.findById(coordinatorId);

    if (!coordinator) {
      throw new Error("Coordinator not found");
    }

    if (!coordinator.isActive || !coordinator.isVerified) {
      throw new Error("Coordinator account is not active");
    }

    // Check if email already exists
    const existingUser = await UserModel.findOne({ email: studentData.email });
    if (existingUser) {
      throw new Error("A user with this email already exists");
    }

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");

    // Create user with pre-approved status
    const student = await UserModel.create({
      name: studentData.name,
      email: studentData.email,
      organization: coordinator.organization,
      department: coordinator.department,
      organizationApprovalStatus: 'approved', // Pre-approved
      ApprovedBy: coordinatorId as any,
      approvedByType: 'department_coordinator',
      ApprovedAt: new Date(),
      isVerified: false, // Still needs to set password
      verificationToken,
      isActive: true
    });

    // Send verification email
    const { sendVerificationEmail } = await import('./email');
    await sendVerificationEmail(studentData.email, verificationToken);

    // Update department stats
    await this.updateDepartmentStats(coordinator.department.toString());

    return {
      message: "Student added successfully. Verification email sent.",
      studentId: student._id
    };
  }

  // Import Students from CSV (Bulk Addition)
  async importStudentsFromCSV(coordinatorId: string, csvData: Array<{
    name: string;
    email: string;
    organization?: string;
    department?: string;
  }>) {
    // Get coordinator details
    const coordinator = await DepartmentCoordinatorModel.findById(coordinatorId)
      .populate('department', 'departmentName departmentCode');

    if (!coordinator) {
      throw new Error("Coordinator not found");
    }

    if (!coordinator.isActive || !coordinator.isVerified) {
      throw new Error("Coordinator account is not active");
    }

    const results = {
      added: [] as Array<{ name: string; email: string }>,
      skipped: [] as Array<{ name: string; email: string; reason: string }>,
      errors: [] as Array<{ row: number; name: string; email: string; error: string }>
    };

    // Get department info for validation
    const department = coordinator.department as any;
    const departmentName = department.departmentName;
    const departmentCode = department.departmentCode;

    // Process each row
    for (let i = 0; i < csvData.length; i++) {
      const row = csvData[i];

      try {
        // Validate required fields
        if (!row.name || !row.email) {
          results.errors.push({
            row: i + 1,
            name: row.name || '',
            email: row.email || '',
            error: 'Missing required fields (name or email)'
          });
          continue;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(row.email)) {
          results.errors.push({
            row: i + 1,
            name: row.name,
            email: row.email,
            error: 'Invalid email format'
          });
          continue;
        }

        // Check if department field exists and validate
        if (row.department) {
          const rowDept = row.department.trim();
          // Check if it matches coordinator's department (by name or code)
          if (rowDept !== departmentName && rowDept !== departmentCode) {
            results.skipped.push({
              name: row.name,
              email: row.email,
              reason: `Department mismatch: "${rowDept}" does not match your department "${departmentName}"`
            });
            continue;
          }
        }

        // Check if email already exists
        const existingUser = await UserModel.findOne({ email: row.email });
        if (existingUser) {
          results.skipped.push({
            name: row.name,
            email: row.email,
            reason: 'Email already exists in system'
          });
          continue;
        }

        // Check for duplicate within this CSV batch
        const duplicateInBatch = results.added.find(s => s.email === row.email);
        if (duplicateInBatch) {
          results.skipped.push({
            name: row.name,
            email: row.email,
            reason: 'Duplicate email in CSV file'
          });
          continue;
        }

        // Generate verification token
        const verificationToken = crypto.randomBytes(32).toString("hex");

        // Create user with pre-approved status
        await UserModel.create({
          name: row.name.trim(),
          email: row.email.trim().toLowerCase(),
          organization: coordinator.organization,
          department: coordinator.department,
          organizationApprovalStatus: 'approved', // Pre-approved
          ApprovedBy: coordinatorId as any,
          approvedByType: 'department_coordinator',
          ApprovedAt: new Date(),
          isVerified: false,
          verificationToken,
          isActive: true
        });

        // Send verification email
        const { sendVerificationEmail } = await import('./email');
        await sendVerificationEmail(row.email, verificationToken);

        results.added.push({
          name: row.name,
          email: row.email
        });

      } catch (error: any) {
        results.errors.push({
          row: i + 1,
          name: row.name || '',
          email: row.email || '',
          error: error.message || 'Unknown error'
        });
      }
    }

    // Update department stats if any students were added
    if (results.added.length > 0) {
      await this.updateDepartmentStats(coordinator.department.toString());
    }

    return {
      message: `Import completed: ${results.added.length} added, ${results.skipped.length} skipped, ${results.errors.length} errors`,
      summary: {
        totalProcessed: csvData.length,
        successfullyAdded: results.added.length,
        skipped: results.skipped.length,
        errors: results.errors.length
      },
      details: results
    };
  }

  // Get Student by ID (Department Restricted)
  async getStudentById(coordinatorId: string, studentId: string) {
    const coordinator = await DepartmentCoordinatorModel.findById(coordinatorId);

    if (!coordinator) {
      throw new Error("Coordinator not found");
    }

    const student = await UserModel.findOne({
      _id: studentId,
      department: coordinator.department,
      isDeleted: false
    })
      .populate('department', 'departmentName departmentCode')
      .select('-passwordHash');

    if (!student) {
      throw new Error("Student not found or doesn't belong to your department");
    }

    return student;
  }

  // Update Student (Department Restricted - Cannot change department)
  async updateStudent(coordinatorId: string, studentId: string, updateData: {
    name?: string;
    email?: string;
  }) {
    const coordinator = await DepartmentCoordinatorModel.findById(coordinatorId);

    if (!coordinator) {
      throw new Error("Coordinator not found");
    }

    const student = await UserModel.findOne({
      _id: studentId,
      department: coordinator.department,
      isDeleted: false
    });

    if (!student) {
      throw new Error("Student not found or doesn't belong to your department");
    }

    // If updating email, check for duplicates
    if (updateData.email && updateData.email !== student.email) {
      const existingUser = await UserModel.findOne({ email: updateData.email });
      if (existingUser) {
        throw new Error("A user with this email already exists");
      }
    }

    // Update fields (coordinators cannot change department)
    if (updateData.name) student.name = updateData.name;
    if (updateData.email) student.email = updateData.email;

    await student.save();

    return {
      message: "Student updated successfully",
      student: await UserModel.findById(studentId)
        .populate('department', 'departmentName departmentCode')
        .select('-passwordHash')
    };
  }

  // Archive Student (Department Restricted)
  async archiveStudent(coordinatorId: string, studentId: string) {
    const coordinator = await DepartmentCoordinatorModel.findById(coordinatorId);

    if (!coordinator) {
      throw new Error("Coordinator not found");
    }

    const student = await UserModel.findOne({
      _id: studentId,
      department: coordinator.department,
      isDeleted: false
    });

    if (!student) {
      throw new Error("Student not found or doesn't belong to your department");
    }

    if (student.isDeleted) {
      throw new Error("Student is already archived");
    }

    // Soft delete
    student.isDeleted = true;
    student.deletedAt = new Date();
    student.isActive = false;
    await student.save();

    // Update department stats
    await this.updateDepartmentStats(coordinator.department.toString());

    return {
      message: "Student archived successfully"
    };
  }

  // Unarchive Student (Department Restricted)
  async unarchiveStudent(coordinatorId: string, studentId: string) {
    const coordinator = await DepartmentCoordinatorModel.findById(coordinatorId);

    if (!coordinator) {
      throw new Error("Coordinator not found");
    }

    // Find student in department (even if deleted)
    const student = await UserModel.findOne({
      _id: studentId,
      department: coordinator.department
    });

    if (!student) {
      throw new Error("Student not found or doesn't belong to your department");
    }

    if (!student.isDeleted) {
      throw new Error("Student is not archived");
    }

    // Restore
    student.isDeleted = false;
    student.deletedAt = undefined;
    student.isActive = true;
    await student.save();

    // Update department stats
    await this.updateDepartmentStats(coordinator.department.toString());

    return {
      message: "Student unarchived successfully"
    };
  }

  // Get Student Portfolio (Department Restricted)
  async getStudentPortfolio(coordinatorId: string, studentId: string) {
    const coordinator = await DepartmentCoordinatorModel.findById(coordinatorId);

    if (!coordinator) {
      throw new Error("Coordinator not found");
    }

    // Verify student belongs to coordinator's department
    const student = await UserModel.findOne({
      _id: studentId,
      department: coordinator.department,
      isDeleted: false
    });

    if (!student) {
      throw new Error("Student not found or doesn't belong to your department");
    }

    // Get portfolio holdings
    const holdings = await PortfolioHolding.find({ userId: studentId })
      .sort({ currentValue: -1 })
      .lean();

    // Get all executed trades for this student
    const trades = await PaperTradeModel.find({
      userId: studentId,
      status: 'EXECUTED'
    }).sort({ executedAt: 1 }).lean();

    // Group trades by symbol
    const tradesBySymbol: Record<string, any[]> = {};
    for (const trade of trades) {
      if (!tradesBySymbol[trade.symbol]) {
        tradesBySymbol[trade.symbol] = [];
      }
      tradesBySymbol[trade.symbol].push({
        date: trade.executedAt || (trade as any).createdAt,
        type: trade.type,
        quantity: trade.quantity,
        price: trade.price,
        totalAmount: trade.totalAmount,
        reason: trade.reason
      });
    }

    // Attach transactions to each holding
    const holdingsWithTransactions = holdings.map(h => ({
      ...h,
      transactions: tradesBySymbol[h.symbol] || []
    }));

    // Calculate summary
    const totalInvested = holdings.reduce((sum, h) => sum + h.totalInvested, 0);
    const currentValue = holdings.reduce((sum, h) => sum + h.currentValue, 0);
    const totalPL = currentValue - totalInvested;
    const totalPLPercent = totalInvested > 0 ? (totalPL / totalInvested) * 100 : 0;

    return {
      student: {
        id: student._id,
        name: student.name,
        email: student.email
      },
      holdings: holdingsWithTransactions,
      summary: {
        totalHoldings: holdings.length,
        totalInvested,
        currentValue,
        totalPL,
        totalPLPercent: parseFloat(totalPLPercent.toFixed(2))
      }
    };
  }


  // Bulk Archive Students (Department Restricted)
  async bulkArchiveStudents(coordinatorId: string, studentIds: string[]) {
    const coordinator = await DepartmentCoordinatorModel.findById(coordinatorId);
    if (!coordinator) throw new Error("Coordinator not found");

    const result = await UserModel.updateMany(
      { _id: { $in: studentIds }, department: coordinator.department, isDeleted: false },
      { $set: { isDeleted: true, deletedAt: new Date(), isActive: false } }
    );

    await this.updateDepartmentStats(coordinator.department.toString());

    return { message: `${result.modifiedCount} student(s) archived successfully`, modifiedCount: result.modifiedCount };
  }

  // Bulk Unarchive Students (Department Restricted)
  async bulkUnarchiveStudents(coordinatorId: string, studentIds: string[]) {
    const coordinator = await DepartmentCoordinatorModel.findById(coordinatorId);
    if (!coordinator) throw new Error("Coordinator not found");

    const result = await UserModel.updateMany(
      { _id: { $in: studentIds }, department: coordinator.department, isDeleted: true },
      { $set: { isDeleted: false, isActive: true }, $unset: { deletedAt: 1 } }
    );

    await this.updateDepartmentStats(coordinator.department.toString());

    return { message: `${result.modifiedCount} student(s) unarchived successfully`, modifiedCount: result.modifiedCount };
  }

  // Update Department Stats
  private async updateDepartmentStats(departmentId: string) {
    const totalStudents = await UserModel.countDocuments({
      department: departmentId,
      isDeleted: false
    });

    const activeStudents = await UserModel.countDocuments({
      department: departmentId,
      organizationApprovalStatus: 'approved',
      isActive: true,
      isDeleted: false
    });

    await DepartmentModel.findByIdAndUpdate(departmentId, {
      totalStudents,
      activeStudents
    });
  }

  // Helper: Generate Tokens
  private generateAccessToken(coordinator: IDepartmentCoordinator) {
    return jwt.sign(
      {
        id: coordinator._id,
        email: coordinator.email,
        role: 'department_coordinator',
        name: coordinator.name,
        department: coordinator.department,
        organization: coordinator.organization,
        isActive: coordinator.isActive
      },
      ENV.JWT_SECRET,
      { expiresIn: ENV.JWT_EXPIRES_IN as any }
    );
  }

  private generateRefreshToken(coordinator: IDepartmentCoordinator) {
    return jwt.sign(
      { id: coordinator._id },
      ENV.JWT_REFRESH_SECRET,
      { expiresIn: ENV.JWT_REFRESH_EXPIRES_IN as any }
    );
  }

  private sanitizeCoordinator(coordinator: any) {
    return {
      id: coordinator._id,
      name: coordinator.name,
      email: coordinator.email,
      mobile: coordinator.mobile,
      designation: coordinator.designation,
      role: coordinator.role,
      organization: coordinator.organization,
      department: coordinator.department,
      isVerified: coordinator.isVerified,
      isActive: coordinator.isActive
    };
  }

  // Delete Coordinator (by Org Admin)
  async deleteCoordinator(coordinatorId: string, organizationId: string) {
    const coordinator = await DepartmentCoordinatorModel.findOne({
      _id: coordinatorId,
      organization: organizationId
    });

    if (!coordinator) {
      throw new Error("Coordinator not found or doesn't belong to your organization");
    }

    coordinator.isDeleted = true;
    coordinator.deletedAt = new Date();
    await coordinator.save();

    // Update department stats
    await this.updateDepartmentStats(coordinator.department.toString());

    return { message: "Coordinator removed successfully" };
  }

  // Get All Coordinators by Organization (for Org Admin)
  async getCoordinatorsByOrganization(organizationId: string) {
    const coordinators = await DepartmentCoordinatorModel.find({
      organization: organizationId,
      isDeleted: false
    })
      .populate('department', 'departmentName departmentCode')
      .select('-passwordHash')
      .sort({ createdAt: -1 });

    return coordinators;
  }
}
