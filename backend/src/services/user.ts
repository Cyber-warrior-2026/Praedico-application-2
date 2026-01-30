import { UserModel } from "../models/user";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import {
  sendVerificationEmail,
  sendPasswordResetEmail,
} from "./email";
import { ENV } from "../config/env";

export class UserService {
  
  // =================================================================
  // 1. REGISTER
  // =================================================================
  async register(email: string, name?: string) {
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
      await existingUser.save();
    } else {
      // Scenario: New User
      await UserModel.create({
        email,
        name: nameToSave,
        isVerified: false,
        verificationToken,
        isActive: true, // <--- Explicitly set to TRUE for new users
      });
    }

    await sendVerificationEmail(email, verificationToken);

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
  async login(email: string, plainPass: string) {
    // Select passwordHash to verify password
    // Mongoose selects 'isActive' by default (unless schema has select: false)
    const user = await UserModel.findOne({ email }).select("+passwordHash");

    if (!user) throw new Error("Invalid credentials");
    if (!user.isVerified) throw new Error("Please verify your email first");

    // 🛑 SECURITY GATE 1: Check Database Status
    // If the Admin set this to false, we block the login immediately.
    if (user.isActive === false) {
      throw new Error("Your account has been deactivated. Please contact support.");
    }

    const isValid = await argon2.verify(user.passwordHash!, plainPass);
    if (!isValid) throw new Error("Invalid credentials");

    // Generate Tokens (Embeds the status)
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

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    if (role && role !== 'all') {
      query.role = role;
    }

    if (status === 'active') {
      query.isActive = true;
      query.isVerified = true;
    } else if (status === 'inactive') {
      query.isActive = false;
    } else if (status === 'unverified') {
      query.isVerified = false;
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
    const total = await UserModel.countDocuments();
    const active = await UserModel.countDocuments({ isActive: true, isVerified: true });
    const inactive = await UserModel.countDocuments({ isActive: false });
    const blocked = await UserModel.countDocuments({ isActive: false, isVerified: true });
    const registered = await UserModel.countDocuments({ isVerified: true });
    
    const adminCount = await UserModel.countDocuments({ role: 'admin' });
    const superAdminCount = await UserModel.countDocuments({ role: 'super_admin' });
    const userCount = await UserModel.countDocuments({ role: 'user' });

    return {
      totalUsers: total,
      activeUsers: active,
      inactiveUsers: inactive,
      blockedUsers: blocked,
      registeredUsers: registered,
      byRole: {
        admin: adminCount,
        super_admin: superAdminCount,
        user: userCount
      }
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
      if (allowedUpdates.includes(key)) {
        updates[key] = updateData[key];
      }
    });

    const user = await UserModel.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-passwordHash -verificationToken -resetPasswordToken');

    if (!user) throw new Error('User not found');
    return user;
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
}