import { UserModel } from './user.model';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import crypto from 'crypto'; // Built-in Node module for random tokens
import { sendVerificationEmail, sendPasswordResetEmail } from '../notifications/email.service'; // You need to create this import

export class UserService {

  // 1. Step One: User enters email -> System sends magic link
  static async initiateRegistration(email: string) {
    const existingUser = await UserModel.findOne({ email });
    
    if (existingUser && existingUser.isVerified) {
      throw new Error('Email already registered');
    }

    // Generate a random 32-byte hex token
    const verificationToken = crypto.randomBytes(32).toString('hex');

    if (existingUser && !existingUser.isVerified) {
      // If user tried to register before but didn't finish, update the token
      existingUser.verificationToken = verificationToken;
      await existingUser.save();
    } else {
      // Create new unverified user
      await UserModel.create({
        email,
        isVerified: false,
        verificationToken
      });
    }

    // Send Email (This calls the Notification Module)
    await sendVerificationEmail(email, verificationToken);
    
    return { message: "Verification email sent. Please check your inbox." };
  }

  // 2. Step Two: User clicks link & sets password
  static async completeRegistration(token: string, plainPassword: string) {
    // Find user by the secret token
    // We explicitly select verificationToken because it's hidden by default in Schema
    const user = await UserModel.findOne({ verificationToken: token }).select('+verificationToken');

    if (!user) throw new Error('Invalid or expired token');

    // Security: Hash the password
    const passwordHash = await argon2.hash(plainPassword);

    // Update User
    user.passwordHash = passwordHash;
    user.isVerified = true;
    user.verificationToken = undefined; // Clear the token so it can't be used again
    await user.save();

    // Auto-login: Generate JWT immediately
    const jwtToken = jwt.sign(
      { id: user._id, role: 'user' },
      process.env.JWT_SECRET as string,
      { expiresIn: '7d' }
    );

    return { token: jwtToken, user };
  }

  // 3. Login
  static async login(email: string, plainPass: string) {
    const user = await UserModel.findOne({ email }).select('+passwordHash');

    if (!user) throw new Error('Invalid credentials');
    if (!user.isVerified) throw new Error('Please verify your email first');

    // Verify Password
    const isValid = await argon2.verify(user.passwordHash!, plainPass);
    if (!isValid) throw new Error('Invalid credentials');

    // Generate Token
    const token = jwt.sign(
      { id: user._id, role: 'user' },
      process.env.JWT_SECRET as string,
      { expiresIn: '7d' }
    );

    return token;
  }

  // 4. Forgot Password
  static async forgotPassword(email: string) {
    const user = await UserModel.findOne({ email });
    if (!user) throw new Error('If email exists, a reset link has been sent'); // Privacy: Don't reveal if user exists

    // Generate Reset Token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = Date.now() + 3600000; // 1 Hour from now

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(resetExpires);
    await user.save();

    await sendPasswordResetEmail(email, resetToken);

    return { message: "If email exists, a reset link has been sent" };
  }

  // 5. Reset Password
  static async resetPassword(token: string, newPassword: string) {
    const user = await UserModel.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) throw new Error('Token is invalid or has expired');

    user.passwordHash = await argon2.hash(newPassword);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return { message: "Password reset successful. Please login." };
  }
}