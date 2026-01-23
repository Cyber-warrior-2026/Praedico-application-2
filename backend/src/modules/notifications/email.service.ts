import nodemailer from 'nodemailer';
import { ENV } from '../../config/env';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: ENV.EMAIL_USER,
    pass: ENV.EMAIL_PASS
  }
});

export const sendVerificationEmail = async (email: string, token: string) => {
  const verificationLink = `${ENV.FRONTEND_URL}/verify?token=${token}`;
  
  await transporter.sendMail({
    from: `"Team Uplink" <${ENV.EMAIL_USER}>`,
    to: email,
    subject: 'Verify Your Email',
    html: `<p>Click <a href="${verificationLink}">here</a> to verify and set password.</p>`
  });
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `${ENV.FRONTEND_URL}/reset-password?token=${token}`;
  
  await transporter.sendMail({
    from: `"Team Uplink" <${ENV.EMAIL_USER}>`,
    to: email,
    subject: 'Reset Your Password',
    html: `<p>Click <a href="${resetLink}">here</a> to reset password.</p>`
  });
};
