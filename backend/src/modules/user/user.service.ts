import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { User } from './user.model';
import { AppError } from '../../common/errors/errorHandler';
import { sendVerificationEmail, sendPasswordResetEmail } from '../notifications/email.service';
import { ENV } from '../../config/env';

export class UserService {
  async registerUser(email: string) {
    const existingUser = await User.findOne({ email });
    
    if (existingUser?.isVerified) {
      throw new AppError('User already exists', 400);
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    if (existingUser) {
      existingUser.verificationToken = token;
      existingUser.verificationTokenExpires = expiresAt;
      await existingUser.save();
    } else {
      await User.create({
        email,
        verificationToken: token,
        verificationTokenExpires: expiresAt
      });
    }

    await sendVerificationEmail(email, token);
    return { message: 'Verification email sent' };
  }

  async verifyEmailAndSetPassword(token: string, password: string) {
    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() }
    });

    if (!user) throw new AppError('Invalid or expired token', 400);

    user.password = password;
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    return { message: 'Email verified successfully' };
  }

  async loginUser(email: string, password: string) {
    const user = await User.findOne({ email }).select('+password');

    if (!user || !user.password) throw new AppError('Invalid credentials', 401);
    if (!user.isVerified) throw new AppError('Please verify your email', 401);

    const isMatch = await user.comparePassword(password);
    if (!isMatch) throw new AppError('Invalid credentials', 401);

    const accessToken = jwt.sign({ id: user.id, email: user.email }, ENV.JWT_SECRET, {
      expiresIn: ENV.JWT_EXPIRES_IN
    });

    const refreshToken = jwt.sign({ id: user.id }, ENV.JWT_REFRESH_SECRET, {
      expiresIn: ENV.JWT_REFRESH_EXPIRES_IN
    });

    return {
      accessToken,
      refreshToken,
      user: { id: user.id, email: user.email, isVerified: user.isVerified }
    };
  }

  async forgotPassword(email: string) {
    const user = await User.findOne({ email });
    if (!user) return { message: 'If account exists, reset link sent' };

    const token = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = new Date(Date.now() + 30 * 60 * 1000);
    await user.save();

    await sendPasswordResetEmail(email, token);
    return { message: 'If account exists, reset link sent' };
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) throw new AppError('Invalid or expired token', 400);

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return { message: 'Password reset successful' };
  }
}
