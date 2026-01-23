import { UserModel } from "./user.model";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import {
  sendVerificationEmail,
  sendPasswordResetEmail,
} from "../notifications/email.service"; // Ensure this path is correct
import { ENV } from "../../config/env";

export class UserService {
  // 1. Register (Step One: Send Email)
  async register(email: string) {
    const existingUser = await UserModel.findOne({ email });

    if (existingUser && existingUser.isVerified) {
      throw new Error("Email already registered");
    }

    const verificationToken = crypto.randomBytes(32).toString("hex");

    if (existingUser && !existingUser.isVerified) {
      existingUser.verificationToken = verificationToken;
      await existingUser.save();
    } else {
      await UserModel.create({ email, isVerified: false, verificationToken });
    }

    await sendVerificationEmail(email, verificationToken);

    return { message: "Verification email sent. Check your inbox." };
  }

  // 2. Verify (Step Two: Set Password & Auto-Login)
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
    const { accessToken, refreshToken } = this.generateTokens(
      user._id.toString(),
    );

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
    const { accessToken, refreshToken } = this.generateTokens(
      user._id.toString(),
    );

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
  private generateTokens(userId: string) {
    const accessToken = jwt.sign({ id: userId, role: "user" }, ENV.JWT_SECRET, {
      expiresIn: ENV.JWT_EXPIRES_IN,
    } as jwt.SignOptions);

    const refreshToken = jwt.sign(
      { id: userId },
      ENV.JWT_REFRESH_SECRET, // Make sure this is in your env.ts
      { expiresIn: ENV.JWT_REFRESH_EXPIRES_IN } as jwt.SignOptions,
    );

    return { accessToken, refreshToken };
  }
}
