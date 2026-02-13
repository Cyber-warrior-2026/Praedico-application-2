import { DepartmentCoordinatorModel, IDepartmentCoordinator } from "../models/departmentCoordinator";
import { UserModel } from "../models/user";
import { DepartmentModel } from "../models/department";
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
      department: coordinator.department,
      isDeleted: false
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
