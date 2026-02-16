import { OrganizationModel, IOrganization } from "../models/organization";
import { OrganizationAdminModel } from "../models/organizationAdmin";
import { DepartmentModel } from "../models/department";
import { DepartmentCoordinatorModel } from "../models/departmentCoordinator";
import { UserModel } from "../models/user";
import PortfolioHolding from "../models/portfolio";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { ENV } from "../config/env";
import {
  sendOrganizationVerificationEmail,
  sendStudentApprovalNotificationToOrganization,
  sendStudentApprovalEmail,
  sendStudentRejectionEmail,
  sendOrganizationAdminInviteEmail
} from "./email";


export class OrganizationService {

  // Register Organization (Initial Registration)
  async register(data: {
    organizationName: string;
    organizationType: 'university' | 'college' | 'institute' | 'school' | 'other';
    address: string;
    city: string;
    state: string;
    pincode: string;
    country?: string;
    contactEmail: string;
    contactPhone: string;
    website?: string;
    registeredBy: {
      name: string;
      email: string;
      designation: string;
    };
  }) {
    const existingOrg = await OrganizationModel.findOne({ contactEmail: data.contactEmail });
    if (existingOrg) {
      throw new Error("Organization with this email already exists");
    }

    const verificationToken = crypto.randomBytes(32).toString("hex");

    const organization = await OrganizationModel.create({
      ...data,
      country: data.country || 'India',
      verificationToken,
      isVerified: false,
      totalAdmins: 1
    });

    await sendOrganizationVerificationEmail(
      data.registeredBy.email,
      verificationToken,
      data.organizationName,
      data.registeredBy.name
    );

    return {
      message: "Organization registered! Please check email to verify account.",
      organizationId: organization._id
    };
  }

  // Verify Organization & Set Password (Creates first admin)
  async verify(token: string, password: string) {
    const organization = await OrganizationModel.findOne({ verificationToken: token })
      .select("+verificationToken");

    if (!organization) {
      throw new Error("Invalid or expired verification token");
    }

    const hashedPassword = await argon2.hash(password);

    // Create Organization Admin
    const orgAdmin = await OrganizationAdminModel.create({
      organization: organization._id,
      name: organization.registeredBy.name,
      email: organization.registeredBy.email,
      mobile: organization.contactPhone,
      designation: organization.registeredBy.designation as any,
      passwordHash: hashedPassword,
      isVerified: true,
      isActive: true
    });

    organization.isVerified = true;
    organization.verificationToken = undefined;
    await organization.save();

    const accessToken = this.generateAccessToken(orgAdmin, organization);
    const refreshToken = this.generateRefreshToken(orgAdmin);

    return {
      organization: this.sanitizeOrganization(organization),
      admin: this.sanitizeAdmin(orgAdmin),
      accessToken,
      refreshToken
    };
  }

  // Login Organization Admin
  async login(email: string, password: string) {
    const admin = await OrganizationAdminModel.findOne({ email })
      .select("+passwordHash")
      .populate('organization');

    if (!admin) {
      throw new Error("Invalid email or password");
    }

    if (!admin.isVerified) {
      throw new Error("Please verify your email first");
    }

    if (!admin.isActive) {
      throw new Error("Your account has been deactivated");
    }

    const organization = await OrganizationModel.findById(admin.organization);

    if (!organization || !organization.isActive) {
      throw new Error("Organization is inactive. Contact support.");
    }

    const isPasswordValid = await argon2.verify(admin.passwordHash!, password);
    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    admin.lastLogin = new Date();
    admin.lastActive = new Date();
    await admin.save();

    const accessToken = this.generateAccessToken(admin, organization);
    const refreshToken = this.generateRefreshToken(admin);

    return {
      organization: this.sanitizeOrganization(organization),
      admin: this.sanitizeAdmin(admin),
      accessToken,
      refreshToken
    };
  }

  // Get Organization Admin Profile
  async getAdminById(adminId: string) {
    const admin = await OrganizationAdminModel.findById(adminId)
      .populate('organization');

    if (!admin) {
      throw new Error("Admin not found");
    }

    const organization = await OrganizationModel.findById(admin.organization);

    return {
      organization: this.sanitizeOrganization(organization!),
      admin: this.sanitizeAdmin(admin)
    };
  }

  // Create Additional Organization Admin
  async createAdmin(organizationId: string, data: {
    name: string;
    email: string;
    mobile: string;
    designation: 'dean' | 'director' | 'principal' | 'admin' | 'other';
  }) {
    const existingAdmin = await OrganizationAdminModel.findOne({ email: data.email });
    if (existingAdmin) {
      throw new Error("Admin with this email already exists");
    }

    const verificationToken = crypto.randomBytes(32).toString("hex");

    const admin = await OrganizationAdminModel.create({
      organization: organizationId,
      ...data,
      verificationToken,
      isVerified: false
    });

    const organization = await OrganizationModel.findById(organizationId);

    await sendOrganizationAdminInviteEmail(
      data.email,
      data.name,
      verificationToken,
      organization!.organizationName
    );

    // Update organization stats
    await this.updateOrganizationStats(organizationId);

    return {
      message: "Admin invited successfully. Verification email sent.",
      adminId: admin._id
    };
  }

  // Get Pending Student Approvals (All departments)
  async getPendingStudents(organizationId: string) {
    const students = await UserModel.find({
      organization: organizationId,
      organizationApprovalStatus: 'pending',
      isDeleted: false
    })
      .populate('department', 'departmentName departmentCode')
      .select('-passwordHash')
      .sort({ createdAt: -1 });

    return students;
  }

  // Approve Student (Organization Admin can approve from any department)
  async approveStudent(adminId: string, studentId: string) {
    const admin = await OrganizationAdminModel.findById(adminId);

    if (!admin) {
      throw new Error("Admin not found");
    }

    const student = await UserModel.findOne({
      _id: studentId,
      organization: admin.organization
    });

    if (!student) {
      throw new Error("Student not found or doesn't belong to your organization");
    }

    if (student.organizationApprovalStatus === 'approved') {
      throw new Error("Student is already approved");
    }

    student.organizationApprovalStatus = 'approved';
    student.ApprovedBy = adminId as any;
    student.approvedByType = 'organization_admin';
    student.ApprovedAt = new Date();
    await student.save();

    // Update stats
    await this.updateOrganizationStats(admin.organization.toString());
    if (student.department) {
      await this.updateDepartmentStats(student.department.toString());
    }

    // Send approval email
    await sendStudentApprovalEmail(student.email, student.name);

    return { message: "Student approved successfully" };
  }

  // Reject Student
  async rejectStudent(adminId: string, studentId: string, reason?: string) {
    const admin = await OrganizationAdminModel.findById(adminId);

    if (!admin) {
      throw new Error("Admin not found");
    }

    const student = await UserModel.findOne({
      _id: studentId,
      organization: admin.organization
    });

    if (!student) {
      throw new Error("Student not found or doesn't belong to your organization");
    }

    student.organizationApprovalStatus = 'rejected';
    student.RejectedReason = reason || 'No reason provided';
    await student.save();

    // Update stats
    await this.updateOrganizationStats(admin.organization.toString());
    if (student.department) {
      await this.updateDepartmentStats(student.department.toString());
    }

    // Send rejection email
    await sendStudentRejectionEmail(student.email, student.name, reason);

    return { message: "Student rejected" };
  }

  // Get All Students in Organization
  async getStudents(organizationId: string, filters?: {
    status?: string;
    departmentId?: string;
  }) {
    const query: any = {
      organization: organizationId
    };

    if (filters?.status) {
      query.organizationApprovalStatus = filters.status;
    }

    if (filters?.departmentId) {
      query.department = filters.departmentId;
    }

    const students = await UserModel.find(query)
      .populate('department', 'departmentName departmentCode')
      .select('-passwordHash')
      .sort({ createdAt: -1 });

    return students;
  }

  // Add Student Directly (No Approval Needed) - Organization Admin
  async addStudentDirectly(adminId: string, studentData: {
    name: string;
    email: string;
    departmentId: string;
  }) {
    // Get admin details
    const admin = await OrganizationAdminModel.findById(adminId);

    if (!admin) {
      throw new Error("Admin not found");
    }

    if (!admin.isActive || !admin.isVerified) {
      throw new Error("Admin account is not active");
    }

    // Verify department belongs to organization
    const department = await DepartmentModel.findOne({
      _id: studentData.departmentId,
      organization: admin.organization
    });

    if (!department) {
      throw new Error("Department not found or doesn't belong to your organization");
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
      organization: admin.organization,
      department: studentData.departmentId,
      organizationApprovalStatus: 'approved', // Pre-approved
      ApprovedBy: adminId as any,
      approvedByType: 'organization_admin',
      ApprovedAt: new Date(),
      isVerified: false, // Still needs to set password
      verificationToken,
      isActive: true
    });

    // Send verification email
    const { sendVerificationEmail } = await import('./email');
    await sendVerificationEmail(studentData.email, verificationToken);

    // Update stats
    await this.updateOrganizationStats(admin.organization.toString());
    await this.updateDepartmentStats(studentData.departmentId);

    return {
      message: "Student added successfully. Verification email sent.",
      studentId: student._id
    };
  }

  // Import Students from CSV (Bulk Addition) - Organization Admin
  async importStudentsFromCSV(adminId: string, csvData: Array<{
    name: string;
    email: string;
    department: string;
  }>) {
    // Get admin details
    const admin = await OrganizationAdminModel.findById(adminId);

    if (!admin) {
      throw new Error("Admin not found");
    }

    if (!admin.isActive || !admin.isVerified) {
      throw new Error("Admin account is not active");
    }

    // Get all departments for this organization
    const departments = await DepartmentModel.find({
      organization: admin.organization,
      isDeleted: false
    });

    if (departments.length === 0) {
      throw new Error("No departments found in your organization");
    }

    // Create a map for quick department lookup (by name and code)
    const departmentMap = new Map<string, any>();
    departments.forEach(dept => {
      departmentMap.set(dept.departmentName.toLowerCase(), dept);
      departmentMap.set(dept.departmentCode.toLowerCase(), dept);
    });

    const results = {
      added: [] as Array<{ name: string; email: string; department: string }>,
      skipped: [] as Array<{ name: string; email: string; reason: string }>,
      errors: [] as Array<{ row: number; name: string; email: string; error: string }>
    };

    // Process each row
    for (let i = 0; i < csvData.length; i++) {
      const row = csvData[i];

      try {
        // Validate required fields
        if (!row.name || !row.email || !row.department) {
          results.errors.push({
            row: i + 1,
            name: row.name || '',
            email: row.email || '',
            error: 'Missing required fields (name, email, or department)'
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

        // Find department by name or code
        const deptKey = row.department.trim().toLowerCase();
        const department = departmentMap.get(deptKey);

        if (!department) {
          results.skipped.push({
            name: row.name,
            email: row.email,
            reason: `Department "${row.department}" not found in your organization`
          });
          continue;
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
          organization: admin.organization,
          department: department._id,
          organizationApprovalStatus: 'approved', // Pre-approved
          ApprovedBy: adminId as any,
          approvedByType: 'organization_admin',
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
          email: row.email,
          department: department.departmentName
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

    // Update stats if any students were added
    if (results.added.length > 0) {
      await this.updateOrganizationStats(admin.organization.toString());

      // Update stats for all affected departments
      const affectedDepartments = new Set(
        results.added.map(s => {
          const dept = Array.from(departmentMap.values()).find(
            d => d.departmentName === s.department
          );
          return dept?._id.toString();
        }).filter(Boolean)
      );

      for (const deptId of affectedDepartments) {
        await this.updateDepartmentStats(deptId);
      }
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

  // Get Student by ID
  async getStudentById(organizationId: string, studentId: string) {
    const student = await UserModel.findOne({
      _id: studentId,
      organization: organizationId,
      isDeleted: false
    })
      .populate('department', 'departmentName departmentCode')
      .select('-passwordHash');

    if (!student) {
      throw new Error("Student not found or doesn't belong to your organization");
    }

    return student;
  }

  // Update Student
  async updateStudent(adminId: string, studentId: string, updateData: {
    name?: string;
    email?: string;
  }) {
    const admin = await OrganizationAdminModel.findById(adminId);

    if (!admin) {
      throw new Error("Admin not found");
    }

    const student = await UserModel.findOne({
      _id: studentId,
      organization: admin.organization,
      isDeleted: false
    });

    if (!student) {
      throw new Error("Student not found or doesn't belong to your organization");
    }

    // If updating email, check for duplicates
    if (updateData.email && updateData.email !== student.email) {
      const existingUser = await UserModel.findOne({ email: updateData.email });
      if (existingUser) {
        throw new Error("A user with this email already exists");
      }
    }

    // Update fields
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

  // Archive Student (Soft Delete)
  async archiveStudent(adminId: string, studentId: string) {
    const admin = await OrganizationAdminModel.findById(adminId);

    if (!admin) {
      throw new Error("Admin not found");
    }

    const student = await UserModel.findOne({
      _id: studentId,
      organization: admin.organization,
      isDeleted: false
    });

    if (!student) {
      throw new Error("Student not found or doesn't belong to your organization");
    }

    if (student.isDeleted) {
      throw new Error("Student is already archived");
    }

    // Soft delete
    student.isDeleted = true;
    student.deletedAt = new Date();
    student.isActive = false;
    await student.save();

    // Update stats
    await this.updateOrganizationStats(admin.organization.toString());
    if (student.department) {
      await this.updateDepartmentStats(student.department.toString());
    }

    return {
      message: "Student archived successfully"
    };
  }

  // Unarchive Student
  async unarchiveStudent(adminId: string, studentId: string) {
    const admin = await OrganizationAdminModel.findById(adminId);

    if (!admin) {
      throw new Error("Admin not found");
    }

    // Find student in organization (even if deleted)
    const student = await UserModel.findOne({
      _id: studentId,
      organization: admin.organization
    });

    if (!student) {
      throw new Error("Student not found or doesn't belong to your organization");
    }

    if (!student.isDeleted) {
      throw new Error("Student is not archived");
    }

    // Restore
    student.isDeleted = false;
    student.deletedAt = undefined;
    student.isActive = true;
    await student.save();

    // Update stats
    await this.updateOrganizationStats(admin.organization.toString());
    if (student.department) {
      await this.updateDepartmentStats(student.department.toString());
    }

    return {
      message: "Student unarchived successfully"
    };
  }

  // Get Student Portfolio
  async getStudentPortfolio(organizationId: string, studentId: string) {
    // Verify student belongs to organization
    const student = await UserModel.findOne({
      _id: studentId,
      organization: organizationId,
      isDeleted: false
    });

    if (!student) {
      throw new Error("Student not found or doesn't belong to your organization");
    }

    // Get portfolio holdings
    const holdings = await PortfolioHolding.find({ userId: studentId })
      .sort({ currentValue: -1 });


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
      holdings,
      summary: {
        totalHoldings: holdings.length,
        totalInvested,
        currentValue,
        totalPL,
        totalPLPercent: parseFloat(totalPLPercent.toFixed(2))
      }
    };
  }


  // Get Organization Statistics
  async getOrganizationStats(organizationId: string) {
    const organization = await OrganizationModel.findById(organizationId);

    const departments = await DepartmentModel.find({
      organization: organizationId,
      isDeleted: false
    });

    const totalAdmins = await OrganizationAdminModel.countDocuments({
      organization: organizationId,
      isDeleted: false
    });

    const totalCoordinators = await DepartmentCoordinatorModel.countDocuments({
      organization: organizationId,
      isDeleted: false
    });

    const totalStudents = await UserModel.countDocuments({
      organization: organizationId,
      isDeleted: false
    });

    const activeStudents = await UserModel.countDocuments({
      organization: organizationId,
      organizationApprovalStatus: 'approved',
      isActive: true,
      isDeleted: false
    });

    const pendingApprovals = await UserModel.countDocuments({
      organization: organizationId,
      organizationApprovalStatus: 'pending',
      isDeleted: false
    });

    return {
      organization: this.sanitizeOrganization(organization!),
      stats: {
        totalDepartments: departments.length,
        totalAdmins,
        totalCoordinators,
        totalStudents,
        activeStudents,
        pendingApprovals
      },
      departments: departments.map(d => ({
        id: d._id,
        name: d.departmentName,
        code: d.departmentCode,
        totalStudents: d.totalStudents,
        activeStudents: d.activeStudents
      }))
    };
  }

  // Update Organization Stats
  private async updateOrganizationStats(organizationId: string) {
    const totalDepartments = await DepartmentModel.countDocuments({
      organization: organizationId,
      isDeleted: false
    });

    const totalAdmins = await OrganizationAdminModel.countDocuments({
      organization: organizationId,
      isDeleted: false
    });

    const totalCoordinators = await DepartmentCoordinatorModel.countDocuments({
      organization: organizationId,
      isDeleted: false
    });

    const totalStudents = await UserModel.countDocuments({
      organization: organizationId,
      isDeleted: false
    });

    const activeStudents = await UserModel.countDocuments({
      organization: organizationId,
      organizationApprovalStatus: 'approved',
      isActive: true,
      isDeleted: false
    });

    const pendingApprovals = await UserModel.countDocuments({
      organization: organizationId,
      organizationApprovalStatus: 'pending',
      isDeleted: false
    });

    await OrganizationModel.findByIdAndUpdate(organizationId, {
      totalDepartments,
      totalAdmins,
      totalCoordinators,
      totalStudents,
      activeStudents,
      pendingApprovals
    });
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
  private generateAccessToken(admin: any, organization: IOrganization) {
    return jwt.sign(
      {
        id: admin._id,
        email: admin.email,
        role: 'organization_admin',
        name: admin.name,
        organization: organization._id,
        organizationName: organization.organizationName,
        isActive: admin.isActive
      },
      ENV.JWT_SECRET,
      { expiresIn: ENV.JWT_EXPIRES_IN as any }
    );
  }

  private generateRefreshToken(admin: any) {
    return jwt.sign(
      { id: admin._id },
      ENV.JWT_REFRESH_SECRET,
      { expiresIn: ENV.JWT_REFRESH_EXPIRES_IN as any }
    );
  }

  private sanitizeOrganization(organization: IOrganization) {
    return {
      id: organization._id,
      organizationName: organization.organizationName,
      organizationType: organization.organizationType,
      address: organization.address,
      city: organization.city,
      state: organization.state,
      pincode: organization.pincode,
      country: organization.country,
      contactEmail: organization.contactEmail,
      contactPhone: organization.contactPhone,
      website: organization.website,
      isVerified: organization.isVerified,
      isActive: organization.isActive,
      totalDepartments: organization.totalDepartments,
      totalAdmins: organization.totalAdmins,
      totalCoordinators: organization.totalCoordinators,
      totalStudents: organization.totalStudents,
      activeStudents: organization.activeStudents,
      pendingApprovals: organization.pendingApprovals
    };
  }

  private sanitizeAdmin(admin: any) {
    return {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      mobile: admin.mobile,
      designation: admin.designation,
      role: admin.role,
      isVerified: admin.isVerified,
      isActive: admin.isActive
    };
  }

  // Get Public List of Organizations (for registration dropdown)
  async getPublicList() {
    return await OrganizationModel.find({
      isVerified: true,
      isActive: true,
      isDeleted: false
    })
      .select('_id organizationName organizationType city state')
      .sort({ organizationName: 1 });
  }

  // Get All Organizations (for platform admin)
  async getAllOrganizations(filters?: {
    page?: number;
    limit?: number;
    search?: string;
  }) {
    const page = filters?.page || 1;
    const limit = filters?.limit || 10;
    const skip = (page - 1) * limit;

    const query: any = { isDeleted: false };

    if (filters?.search) {
      query.$or = [
        { organizationName: { $regex: filters.search, $options: 'i' } },
        { contactEmail: { $regex: filters.search, $options: 'i' } },
        { city: { $regex: filters.search, $options: 'i' } }
      ];
    }

    const organizations = await OrganizationModel.find(query)
      .select('-passwordHash')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await OrganizationModel.countDocuments(query);

    return {
      organizations,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  // Toggle Organization Active Status (for platform admin)
  async toggleOrganizationActive(organizationId: string) {
    const organization = await OrganizationModel.findById(organizationId);
    if (!organization) throw new Error('Organization not found');

    organization.isActive = !organization.isActive;
    await organization.save();

    return organization;
  }
}
