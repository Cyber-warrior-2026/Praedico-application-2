import { UserModel } from "../models/user.model";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import {
  sendVerificationEmail,
  sendPasswordResetEmail,
} from "./email.service";
import { ENV } from "../config/env";

export class UserService {
  // 1. Register (Updated to accept Name)
  async register(email: string, name?: string) {
    const existingUser = await UserModel.findOne({ email });

    if (existingUser && existingUser.isVerified) {
      throw new Error("Email already registered");
    }

    // SMART NAME LOGIC:
    // If 'name' is provided, use it.
    // If not, assume the first part of the email (e.g. "arjun" from "arjun@gmail.com")
    // This prevents the hardcoded "User" from ever entering your database.
    const nameToSave = name && name.trim() !== "" ? name : email.split("@")[0];

    const verificationToken = crypto.randomBytes(32).toString("hex");

    if (existingUser && !existingUser.isVerified) {
      // Update existing unverified user
      existingUser.verificationToken = verificationToken;
      existingUser.name = nameToSave; // Update the name
      await existingUser.save();
    } else {
      // Create new user with Name
      await UserModel.create({
        email,
        name: nameToSave, // <--- CRITICAL FIX
        isVerified: false,
        verificationToken,
      });
    }

    await sendVerificationEmail(email, verificationToken);

    return { message: "Verification email sent. Check your inbox." };
  }

  // 2. Verify
  async verify(token: string, plainPassword: string) {
    const user = await UserModel.findOne({ verificationToken: token }).select(
      "+verificationToken",
    );

    if (!user) throw new Error("Invalid or expired token");

    const passwordHash = await argon2.hash(plainPassword);

    user.passwordHash = passwordHash;
    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    // Generate Tokens
    const { accessToken, refreshToken } = this.generateTokens(user);

    return { user, accessToken, refreshToken };
  }

  // 3. Login
  async login(email: string, plainPass: string) {
    const user = await UserModel.findOne({ email }).select("+passwordHash");

    if (!user) throw new Error("Invalid credentials");
    if (!user.isVerified) throw new Error("Please verify your email first");

    const isValid = await argon2.verify(user.passwordHash!, plainPass);
    if (!isValid) throw new Error("Invalid credentials");

    // Generate Tokens
    const { accessToken, refreshToken } = this.generateTokens(user);

    return { user, accessToken, refreshToken };
  }

  // 4. Forgot Password
  async forgotPassword(email: string) {
    const user = await UserModel.findOne({ email });
    if (!user) throw new Error("If email exists, a reset link has been sent");

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetExpires = Date.now() + 3600000; // 1 Hour

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(resetExpires);
    await user.save();

    await sendPasswordResetEmail(email, resetToken);

    return { message: "If email exists, a reset link has been sent" };
  }

  // 5. Reset Password
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

  // --- Helper: Centralized Token Generation ---
  private generateTokens(user: any) {
    const payload = {
      id: user._id.toString(),
      role: user.role || "user",
      email: user.email,
      name: user.name, // Now this will definitely have a value!
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
}
