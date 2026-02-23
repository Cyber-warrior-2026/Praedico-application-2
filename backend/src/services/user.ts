import { UserModel } from "../models/user";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { Types } from "mongoose";

import {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendStudentApprovalNotificationToOrganization,  // NEW
} from "./email";
import { ENV } from "../config/env";

export class UserService {
  
  // =================================================================
  // 1. REGISTER
  // =================================================================
async register(email: string, name?: string, organizationId?: string, departmentId?: string) {
  const existingUser = await UserModel.findOne({ email });
  if (existingUser && existingUser.isVerified) {
    throw new Error("Email already registered");
  }

  // Smart Name Logic: Use provided name or fallback to email prefix
  const nameToSave = name && name.trim() !== "" ? name : email.split("@")[0];
  const verificationToken = crypto.randomBytes(32).toString("hex");

  if (existingUser && !existingUser.isVerified) {
    // Scenario: User tried to register before but never verified.
    // Resend token and update details.
    existingUser.verificationToken = verificationToken;
    existingUser.name = nameToSave;
    
    // Update organization and department if provided
    if (organizationId) {
      existingUser.organization = organizationId as any;
      existingUser.department = departmentId as any;
      existingUser.organizationApprovalStatus = 'pending';
    }
    
    await existingUser.save();
  } else {
  // Scenario: New User
await UserModel.create({
  email,
  name: nameToSave,
  isVerified: false,
  verificationToken,
  isActive: true,
  // ✅ Only add organization/department if they exist
  ...(organizationId && { 
    organization: organizationId,
    organizationApprovalStatus: 'pending'
  }),
  ...(departmentId && { 
    department: departmentId 
  }),
});

  }

  await sendVerificationEmail(email, verificationToken);
  
  // Notify organization if student registered with organization AND department
  if (organizationId && departmentId) {
    await sendStudentApprovalNotificationToOrganization(
      organizationId,
      departmentId,
      email,
      nameToSave
    );
  }

  return { message: "Verification email sent. Check your inbox." };
}



  // =================================================================
  // 2. VERIFY EMAIL
  // =================================================================
  async verify(token: string, plainPassword: string) {
    const user = await UserModel.findOne({ verificationToken: token }).select(
      "+verificationToken",
    );

    if (!user) throw new Error("Invalid or expired token");

    const passwordHash = await argon2.hash(plainPassword);

    user.passwordHash = passwordHash;
    user.isVerified = true;
    user.verificationToken = undefined;
    
    // Ensure user is active upon verification (optional, depending on your flow)
    user.isActive = true; 
    
    await user.save();

    // Generate Tokens
    const { accessToken, refreshToken } = this.generateTokens(user);

    return { user, accessToken, refreshToken };
  }

  // =================================================================
  // 3. LOGIN (The "Gatekeeper")
  // =================================================================
// =================================================================
// 3. LOGIN (The "Gatekeeper")
// =================================================================
async login(email: string, plainPass: string) {
  const user = await UserModel.findOne({ email }).select("+passwordHash");
  
  if (!user) throw new Error("Invalid credentials");
  
  if (!user.isVerified) throw new Error("Please verify your email first");

  // 🛑 SECURITY GATE: Check if Deleted OR Inactive
  if (user.isDeleted) {
    throw new Error("This account has been deleted. Contact support to restore it.");
  }

  if (user.isActive === false) {
    throw new Error("Your account has been deactivated. Please contact support.");
  }

  // 🆕 NEW: Check Organization Approval Status
  if (user.organization) {
    // Student is linked to an organization - check approval status
    if (user.organizationApprovalStatus === 'pending') {
      throw new Error("Your registration is pending approval from your organization. Please wait for admin/coordinator to approve.");
    }
    
    if (user.organizationApprovalStatus === 'rejected') {
      const reason = user.RejectedReason || 'No reason provided';
      throw new Error(`Your registration was rejected by the organization. Reason: ${reason}. Please contact your organization admin.`);
    }
    
    // Only 'approved' status can proceed
    if (user.organizationApprovalStatus !== 'approved') {
      throw new Error("Access denied. Please contact your organization admin.");
    }
  }
  // If user.organization is null/undefined, it means no organization selected - allow normal login

  const isValid = await argon2.verify(user.passwordHash!, plainPass);
  if (!isValid) throw new Error("Invalid credentials");

  const { accessToken, refreshToken } = this.generateTokens(user);
  
  return { user, accessToken, refreshToken };
}



  // =================================================================
  // 4. FORGOT PASSWORD
  // =================================================================
  async forgotPassword(email: string) {
    const user = await UserModel.findOne({ email });
    // Security Best Practice: Don't reveal if user exists or not
    if (!user) throw new Error("If email exists, a reset link has been sent");

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetExpires = Date.now() + 3600000; // 1 Hour

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(resetExpires);
    await user.save();

    await sendPasswordResetEmail(email, resetToken);

    return { message: "If email exists, a reset link has been sent" };
  }

  // =================================================================
  // 5. RESET PASSWORD
  // =================================================================
  async resetPassword(token: string, newPassword: string) {
    const user = await UserModel.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) throw new Error("Token is invalid or has expired");

    user.passwordHash = await argon2.hash(newPassword);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return { message: "Password reset successful. Please login." };
  }

  // =================================================================
  // HELPER: Centralized Token Generation
  // =================================================================
  private generateTokens(user: any) {
    // We embed 'isActive' into the token payload.
    // This allows the Middleware (Gate 2) to kick users out 
    // without hitting the database on every request.
    const payload = {
      id: user._id.toString(),
      role: user.role || "user",
      email: user.email,
      name: user.name,
      isActive: user.isActive, // <--- CRITICAL
    };

    const accessToken = jwt.sign(payload, ENV.JWT_SECRET, {
      expiresIn: ENV.JWT_EXPIRES_IN,
    } as jwt.SignOptions);

    const refreshToken = jwt.sign(
      { id: user._id.toString() },
      ENV.JWT_REFRESH_SECRET,
      { expiresIn: ENV.JWT_REFRESH_EXPIRES_IN } as jwt.SignOptions,
    );

    return { accessToken, refreshToken };
  }

  // =================================================================
  // ADMIN / DASHBOARD FEATURES
  // =================================================================

  // Get all users with filters
  async getAllUsers(filters: {
    page: number;
    limit: number;
    search: string;
    role: string;
    status: string;
  }) {
    const { page, limit, search, role, status } = filters;
    const skip = (page - 1) * limit;

    const query: any = {};

    // 1. Search Logic
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    // 2. Role Logic
    if (role && role !== 'all') {
      query.role = role;
    }

    // 3. Status Logic (CRITICAL UPDATE)
    if (status === 'deleted') {
      // Only show soft-deleted users
      query.isDeleted = true;
    } else {
      // By default, HIDE deleted users unless specifically asked for
      query.isDeleted = { $ne: true };

      if (status === 'active') {
        query.isActive = true;
        query.isVerified = true;
      } else if (status === 'inactive') {
        query.isActive = false;
      } else if (status === 'unverified') {
        query.isVerified = false;
      }
    }

    const users = await UserModel.find(query)
      .select('-passwordHash -verificationToken -resetPasswordToken')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await UserModel.countDocuments(query);

    return {
      users,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async getUserStats() {
    // Determine counts ensuring 'deleted' users aren't counted as active/inactive
    const total = await UserModel.countDocuments({ isDeleted: { $ne: true } });
    const active = await UserModel.countDocuments({ isActive: true, isVerified: true, isDeleted: { $ne: true } });
    const inactive = await UserModel.countDocuments({ isActive: false, isDeleted: { $ne: true } });
    const blocked = await UserModel.countDocuments({ isActive: false, isVerified: true, isDeleted: { $ne: true } });
    
    // NEW: Count deleted users
    const deleted = await UserModel.countDocuments({ isDeleted: true });

    return {
      totalUsers: total,
      activeUsers: active,
      inactiveUsers: inactive,
      blockedUsers: blocked,
      deletedUsers: deleted, // Return this new stat
      registeredUsers: await UserModel.countDocuments({ isVerified: true }),
    };
  }

  async getUserById(userId: string) {
    const user = await UserModel.findById(userId)
      .select('-passwordHash -verificationToken -resetPasswordToken');
    if (!user) throw new Error('User not found');
    return user;
  }

  async updateUser(userId: string, updateData: any) {
    const allowedUpdates = ['name', 'email', 'role', 'isActive'];
    const updates: any = {};
    Object.keys(updateData).forEach(key => {
      if (allowedUpdates.includes(key)) updates[key] = updateData[key];
    });

    const user = await UserModel.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-passwordHash');

    if (!user) throw new Error('User not found');
    return user;
  }

  async softDeleteUser(userId: string) {
    const user = await UserModel.findById(userId);
    if (!user) throw new Error("User not found");

    user.isDeleted = true;
    user.deletedAt = new Date();
    user.isActive = false; // Automatically deactivate logic access
    await user.save();

    return { message: "User archived successfully" };
  }

  async restoreUser(userId: string) {
    const user = await UserModel.findById(userId);
    if (!user) throw new Error("User not found");

    user.isDeleted = false;
    user.deletedAt = undefined;
    // Optional: Decide if you want to auto-activate or keep them inactive upon restore
    // user.isActive = true; 
    await user.save();

    return { message: "User restored successfully" };
  }

  async deleteUser(userId: string) {
    const user = await UserModel.findByIdAndDelete(userId);
    if (!user) throw new Error('User not found');
    return { message: 'User deleted successfully' };
  }

  async toggleUserActive(userId: string) {
    const user = await UserModel.findById(userId);
    if (!user) throw new Error('User not found');

    user.isActive = !user.isActive;
    await user.save();

    return user;
  }

  // --- BULK OPERATIONS ---
  async bulkSoftDelete(userIds: string[]) {
    const result = await UserModel.updateMany(
      { _id: { $in: userIds }, isDeleted: false },
      { $set: { isDeleted: true, deletedAt: new Date(), isActive: false } }
    );
    return { message: "Users archived successfully", count: result.modifiedCount };
  }

  async bulkRestore(userIds: string[]) {
    const result = await UserModel.updateMany(
      { _id: { $in: userIds }, isDeleted: true },
      // Leave isActive as whatever it is (likely false). Needs manual unblocking if desired
      { $set: { isDeleted: false }, $unset: { deletedAt: "" } }
    );
    return { message: "Users restored successfully", count: result.modifiedCount };
  }

  async bulkToggleActive(userIds: string[], isActive: boolean) {
    const result = await UserModel.updateMany(
      { _id: { $in: userIds }, isDeleted: false },
      { $set: { isActive } }
    );
    return { message: `Users ${isActive ? 'unblocked' : 'blocked'} successfully`, count: result.modifiedCount };
  }
}