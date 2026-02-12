import { InstituteModel, IInstitute } from "../models/institute";
import { UserModel } from "../models/user";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { ENV } from "../config/env";
import { 
  sendInstituteVerificationEmail, 
  sendStudentApprovalNotificationToInstitutes,
  sendStudentApprovalEmail,
  sendStudentRejectionEmail 
} from "./email";

export class InstituteService {
  
  // Register Institute
  async register(data: {
    organizationName: string;
    contactPerson: string;
    address: string;
    email: string;
    mobile: string;
    website?: string;
  }) {
    const existingInstitute = await InstituteModel.findOne({ email: data.email });
    if (existingInstitute) {
      throw new Error("Institute with this email already exists");
    }

    const verificationToken = crypto.randomBytes(32).toString("hex");
    
    const institute = await InstituteModel.create({
      ...data,
      verificationToken,
      isVerified: false,
    });

    await sendInstituteVerificationEmail(data.email, verificationToken, data.organizationName);

    return {
      message: "Institute registered! Please check email to verify account.",
      instituteId: institute._id,
    };
  }

  // Verify Institute Email
  async verify(token: string, password: string) {
    const institute = await InstituteModel.findOne({ verificationToken: token }).select("+verificationToken");
    
    if (!institute) {
      throw new Error("Invalid or expired verification token");
    }

    const hashedPassword = await argon2.hash(password);
    
    institute.passwordHash = hashedPassword;
    institute.isVerified = true;
    institute.verificationToken = undefined;
    await institute.save();

    const accessToken = this.generateAccessToken(institute);
    const refreshToken = this.generateRefreshToken(institute);

    return { 
      institute: this.sanitizeInstitute(institute), 
      accessToken, 
      refreshToken 
    };
  }

  // Login Institute
  async login(email: string, password: string) {
    const institute = await InstituteModel.findOne({ email }).select("+passwordHash");
    
    if (!institute) {
      throw new Error("Invalid email or password");
    }

    if (!institute.isVerified) {
      throw new Error("Please verify your email first");
    }

    if (!institute.isActive) {
      throw new Error("Your account has been deactivated");
    }

    const isPasswordValid = await argon2.verify(institute.passwordHash!, password);
    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    institute.lastLogin = new Date();
    institute.lastActive = new Date();
    await institute.save();

    const accessToken = this.generateAccessToken(institute);
    const refreshToken = this.generateRefreshToken(institute);

    return { 
      institute: this.sanitizeInstitute(institute), 
      accessToken, 
      refreshToken 
    };
  }

  // Get Pending Student Approvals
  async getPendingStudents(instituteId: string) {
    const students = await UserModel.find({
      institute: instituteId,
      instituteApprovalStatus: 'pending'
    }).select('-passwordHash');

    return students;
  }

  // Approve Student
  async approveStudent(instituteId: string, studentId: string) {
    const student = await UserModel.findOne({ 
      _id: studentId, 
      institute: instituteId 
    });

    if (!student) {
      throw new Error("Student not found or doesn't belong to your institute");
    }

    student.instituteApprovalStatus = 'approved';
    student.instituteApprovedBy = instituteId as any;
    student.instituteApprovedAt = new Date();
    await student.save();

    // Update institute stats
    await this.updateInstituteStats(instituteId);

    // Send approval email to student
    await sendStudentApprovalEmail(student.email, student.name);

    return { message: "Student approved successfully" };
  }

  // Reject Student
  async rejectStudent(instituteId: string, studentId: string, reason?: string) {
    const student = await UserModel.findOne({ 
      _id: studentId, 
      institute: instituteId 
    });

    if (!student) {
      throw new Error("Student not found or doesn't belong to your institute");
    }

    student.instituteApprovalStatus = 'rejected';
    student.instituteRejectedReason = reason || 'No reason provided';
    await student.save();

    // Update institute stats
    await this.updateInstituteStats(instituteId);

    // Send rejection email to student
    await sendStudentRejectionEmail(student.email, student.name, reason);

    return { message: "Student rejected" };
  }

  // Get Institute Students
  async getStudents(instituteId: string, status?: string) {
    const filter: any = { institute: instituteId };
    
    if (status) {
      filter.instituteApprovalStatus = status;
    }

    const students = await UserModel.find(filter)
      .select('-passwordHash')
      .sort({ createdAt: -1 });
    
    return students;
  }

  // Forgot Password
  async forgotPassword(email: string) {
    const institute = await InstituteModel.findOne({ email });
    
    if (!institute) {
      throw new Error("If email exists, a reset link has been sent");
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetExpires = Date.now() + 3600000; // 1 Hour

    institute.resetPasswordToken = resetToken;
    institute.resetPasswordExpires = new Date(resetExpires);
    await institute.save();

    // You can create sendInstitutePasswordResetEmail similar to user
    // For now, reusing existing email function
    // await sendPasswordResetEmail(email, resetToken);

    return { message: "If email exists, a reset link has been sent" };
  }

  // Reset Password
  async resetPassword(token: string, newPassword: string) {
    const institute = await InstituteModel.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!institute) throw new Error("Token is invalid or has expired");

    institute.passwordHash = await argon2.hash(newPassword);
    institute.resetPasswordToken = undefined;
    institute.resetPasswordExpires = undefined;
    await institute.save();

    return { message: "Password reset successful. Please login." };
  }

  // Update Institute Stats
  private async updateInstituteStats(instituteId: string) {
    const totalStudents = await UserModel.countDocuments({ institute: instituteId });
    const activeStudents = await UserModel.countDocuments({ 
      institute: instituteId, 
      instituteApprovalStatus: 'approved',
      isActive: true
    });
    const pendingApprovals = await UserModel.countDocuments({ 
      institute: instituteId, 
      instituteApprovalStatus: 'pending' 
    });

    await InstituteModel.findByIdAndUpdate(instituteId, {
      totalStudents,
      activeStudents,
      pendingApprovals
    });
  }

  // Helper: Generate Tokens
  private generateAccessToken(institute: IInstitute) {
    return jwt.sign(
      { 
        id: institute._id, 
        email: institute.email, 
        role: 'institute',
        name: institute.organizationName,
        isActive: institute.isActive
      },
      ENV.JWT_SECRET,
      { expiresIn: ENV.JWT_EXPIRES_IN as any }
    );
  }

  private generateRefreshToken(institute: IInstitute) {
    return jwt.sign(
      { id: institute._id },
      ENV.JWT_REFRESH_SECRET,
      { expiresIn: ENV.JWT_REFRESH_EXPIRES_IN as any}
    );
  }

  private sanitizeInstitute(institute: IInstitute) {
    return {
      id: institute._id,
      organizationName: institute.organizationName,
      contactPerson: institute.contactPerson,
      email: institute.email,
      mobile: institute.mobile,
      address: institute.address,
      website: institute.website,
      role: institute.role,
      isVerified: institute.isVerified,
      isActive: institute.isActive,
      totalStudents: institute.totalStudents,
      activeStudents: institute.activeStudents,
      pendingApprovals: institute.pendingApprovals,
    };
  }

  // Get Institute by ID
  async getInstituteById(id: string) {
    const institute = await InstituteModel.findById(id);
    if (!institute) {
      throw new Error("Institute not found");
    }
    return this.sanitizeInstitute(institute);
  }

  // Get All Institutes (for admin/super_admin)
  async getAllInstitutes(filters?: {
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
        { email: { $regex: filters.search, $options: 'i' } },
        { contactPerson: { $regex: filters.search, $options: 'i' } }
      ];
    }
    
    const institutes = await InstituteModel.find(query)
      .select('-passwordHash')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await InstituteModel.countDocuments(query);
    
    return {
      institutes,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  // Toggle Institute Active Status (for admin)
  async toggleInstituteActive(instituteId: string) {
    const institute = await InstituteModel.findById(instituteId);
    if (!institute) throw new Error('Institute not found');
    
    institute.isActive = !institute.isActive;
    await institute.save();
    
    return institute;
  }
  // Get Public List of Institutes (for registration dropdown)
  async getPublicList() {
    return await InstituteModel.find({ 
      isVerified: true, 
      isActive: true, 
      isDeleted: false 
    })
    .select('_id organizationName')
    .sort({ organizationName: 1 });
  }
}