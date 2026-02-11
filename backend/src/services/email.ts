import nodemailer from "nodemailer";
import { ENV } from "../config/env";
import { InstituteModel } from "../models/institute";


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: ENV.EMAIL_USER,
    pass: ENV.EMAIL_PASS,
  },
});

// Your company logo URL
const LOGO_URL = 'https://raw.githubusercontent.com/Cyber-warrior-2026/Praedico-application-2/main/backend/praedico_global_research_pvt_ltd_logo.jpg';




export const sendVerificationEmail = async (email: string, token: string) => {
  const verificationLink = `${ENV.FRONTEND_URL}/verify/${token}`;

  await transporter.sendMail({
    from: `"Team Praedico" <${ENV.EMAIL_USER}>`,
    to: email,
    subject: '✨ Welcome to praedico Verify Your Email',
    html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Email</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7fa;">
      <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f4f7fa;">
        <tr>
          <td align="center" style="padding: 40px 0;">
            
            <!-- Main Container -->
            <table role="presentation" style="width: 600px; max-width: 100%; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
              
              <!-- Header with Logo -->
              <tr>
                <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                  <img src="${LOGO_URL}" alt="Praedico Global Research Logo" style="max-width: 220px; height: auto; margin-bottom: 20px; background-color: white; padding: 10px; border-radius: 8px;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">Welcome to Praedico! 🎉</h1>
                </td>
              </tr>
              
              <!-- Content Body -->
              <tr>
                <td style="padding: 40px 30px;">
                  <h2 style="color: #333333; font-size: 22px; margin: 0 0 20px 0; font-weight: 600;">Verify Your Email Address</h2>
                  
                  <p style="color: #555555; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                    Thank you for registering with <strong>Praedico</strong>! We're excited to have you on board.
                  </p>
                  
                  <p style="color: #555555; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                    To complete your registration and set your password, please click the button below:
                  </p>
                  
                  <!-- CTA Button -->
                  <table role="presentation" style="width: 100%;">
                    <tr>
                      <td align="center">
                        <a href="${verificationLink}" 
                           style="display: inline-block; 
                                  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                                  color: #ffffff; 
                                  text-decoration: none; 
                                  padding: 16px 40px; 
                                  border-radius: 8px; 
                                  font-size: 16px; 
                                  font-weight: 600;
                                  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
                                  transition: all 0.3s ease;">
                          ✓ Verify Email & Set Password
                        </a>
                      </td>
                    </tr>
                  </table>
                  
                  <!-- Alternative Link -->
                  <p style="color: #888888; font-size: 14px; line-height: 1.6; margin: 30px 0 0 0; text-align: center;">
                    Or copy and paste this link in your browser:
                  </p>
                  <p style="color: #667eea; font-size: 13px; word-break: break-all; text-align: center; margin: 10px 0 0 0;">
                    <a href="${verificationLink}" style="color: #667eea; text-decoration: none;">${verificationLink}</a>
                  </p>
                  
                  <!-- Security Note -->
                  <table role="presentation" style="width: 100%; margin-top: 30px; background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; border-radius: 4px;">
                    <tr>
                      <td>
                        <p style="color: #856404; font-size: 14px; margin: 0; line-height: 1.5;">
                          ⚠️ <strong>Security Note:</strong> This link will expire in <strong>1 hour</strong>. If you didn't create an account with Praedico, please ignore this email.
                        </p>
                      </td>
                    </tr>
                  </table>
                  
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef;">
                  <p style="color: #6c757d; font-size: 14px; margin: 0 0 10px 0;">
                    Need help? Contact us at <a href="mailto:support@praedico.com" style="color: #667eea; text-decoration: none;">support@praedico.com</a>
                  </p>
                  <p style="color: #adb5bd; font-size: 12px; margin: 0;">
                    © 2026 Praedico Global Research Pvt Ltd. All rights reserved.<br>
                    Made with ❤️ by Team Sambhav & Arjun
                  </p>
                </td>
              </tr>
              
            </table>
            
          </td>
        </tr>
      </table>
    </body>
    </html>
    `
  });
};

/**
 * Send Password Reset Email with Beautiful Design
 */
export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `${ENV.FRONTEND_URL}/reset-password/${token}`;

  await transporter.sendMail({
    from: `"Team Praedico" <${ENV.EMAIL_USER}>`,
    to: email,
    subject: '🔐 Reset Your Praedico Password',
    html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Your Password</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7fa;">
      <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f4f7fa;">
        <tr>
          <td align="center" style="padding: 40px 0;">
            
            <!-- Main Container -->
            <table role="presentation" style="width: 600px; max-width: 100%; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
              
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 40px 30px; text-align: center;">
                  <img src="${LOGO_URL}" alt="Praedico Global Research Logo" style="max-width: 220px; height: auto; margin-bottom: 20px; background-color: white; padding: 10px; border-radius: 8px;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">Password Reset Request 🔐</h1>
                </td>
              </tr>
              
              <!-- Content Body -->
              <tr>
                <td style="padding: 40px 30px;">
                  <h2 style="color: #333333; font-size: 22px; margin: 0 0 20px 0; font-weight: 600;">Reset Your Password</h2>
                  
                  <p style="color: #555555; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                    We received a request to reset the password for your <strong>Praedico</strong> account.
                  </p>
                  
                  <p style="color: #555555; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                    Click the button below to create a new password:
                  </p>
                  
                  <!-- CTA Button -->
                  <table role="presentation" style="width: 100%;">
                    <tr>
                      <td align="center">
                        <a href="${resetLink}" 
                           style="display: inline-block; 
                                  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); 
                                  color: #ffffff; 
                                  text-decoration: none; 
                                  padding: 16px 40px; 
                                  border-radius: 8px; 
                                  font-size: 16px; 
                                  font-weight: 600;
                                  box-shadow: 0 4px 12px rgba(245, 87, 108, 0.4);">
                          🔑 Reset Password
                        </a>
                      </td>
                    </tr>
                  </table>
                  
                  <!-- Alternative Link -->
                  <p style="color: #888888; font-size: 14px; line-height: 1.6; margin: 30px 0 0 0; text-align: center;">
                    Or copy and paste this link in your browser:
                  </p>
                  <p style="color: #f5576c; font-size: 13px; word-break: break-all; text-align: center; margin: 10px 0 0 0;">
                    <a href="${resetLink}" style="color: #f5576c; text-decoration: none;">${resetLink}</a>
                  </p>
                  
                  <!-- Security Warnings -->
                  <table role="presentation" style="width: 100%; margin-top: 30px; background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; border-radius: 4px;">
                    <tr>
                      <td>
                        <p style="color: #856404; font-size: 14px; margin: 0 0 10px 0; line-height: 1.5;">
                          ⚠️ <strong>Important:</strong> This link will expire in <strong>30 minutes</strong>.
                        </p>
                        <p style="color: #856404; font-size: 14px; margin: 0; line-height: 1.5;">
                          If you didn't request a password reset, please ignore this email and your password will remain unchanged.
                        </p>
                      </td>
                    </tr>
                  </table>
                  
                  <!-- Additional Help -->
                  <table role="presentation" style="width: 100%; margin-top: 20px; background-color: #e7f3ff; border-left: 4px solid #2196F3; padding: 15px; border-radius: 4px;">
                    <tr>
                      <td>
                        <p style="color: #014361; font-size: 14px; margin: 0; line-height: 1.5;">
                          💡 <strong>Security Tip:</strong> Never share your password with anyone. Praedico will never ask for your password via email.
                        </p>
                      </td>
                    </tr>
                  </table>
                  
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef;">
                  <p style="color: #6c757d; font-size: 14px; margin: 0 0 10px 0;">
                    Need help? Contact us at <a href="mailto:support@praedico.com" style="color: #f5576c; text-decoration: none;">support@praedico.com</a>
                  </p>
                  <p style="color: #adb5bd; font-size: 12px; margin: 0;">
                    © 2026 Praedico Global Research Pvt Ltd. All rights reserved.<br>
                    Made with ❤️ by Team Sambhav & Arjun
                  </p>
                </td>
              </tr>
              
            </table>
            
          </td>
        </tr>
      </table>
    </body>
    </html>
    `
  });
};
// =====================================================
// INSTITUTE EMAIL FUNCTIONS
// =====================================================

// Institute Verification Email
export const sendInstituteVerificationEmail = async (
  email: string, 
  token: string, 
  organizationName: string
) => {
  const verificationLink = `${ENV.FRONTEND_URL}/institute/verify/${token}`;
  
  await transporter.sendMail({
    from: `"Team Praedico" <${ENV.EMAIL_USER}>`,
    to: email,
    subject: '✨ Welcome to Praedico - Verify Your Institute Account',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background: #f4f4f4; }
          .container { max-width: 600px; margin: 20px auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 0 20px rgba(0,0,0,0.1); }
          .header { text-align: center; padding: 30px 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
          .logo { max-width: 150px; }
          .content { padding: 40px 30px; }
          .button { display: inline-block; padding: 15px 40px; background: #667eea; color: white !important; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
          .footer { text-align: center; padding: 20px; background: #f9f9f9; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img src="${LOGO_URL}" alt="Praedico Logo" class="logo" />
          </div>
          <div class="content">
            <h2 style="color: #667eea;">🎉 Welcome ${organizationName}!</h2>
            <p>Thank you for registering your institute with <strong>Praedico</strong>. We're excited to have you onboard!</p>
            <p>Please verify your email address to activate your institute account and start managing your students:</p>
            <center>
              <a href="${verificationLink}" class="button">Verify Institute Account</a>
            </center>
            <p style="font-size: 14px; color: #666;">Or copy this link:<br/> <code style="background: #f4f4f4; padding: 5px 10px; border-radius: 3px;">${verificationLink}</code></p>
            <p style="color: #e74c3c;"><strong>⏰ Note:</strong> This link expires in 24 hours.</p>
          </div>
          <div class="footer">
            <p>© 2026 Praedico Global Research Pvt Ltd. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  });
};

// Notify Institute about New Student Registration
export const sendStudentApprovalNotificationToInstitutes = async (
  instituteId: string,
  studentEmail: string,
  studentName: string
) => {
  const institute = await InstituteModel.findById(instituteId);
  
  if (!institute) return;

  await transporter.sendMail({
    from: `"Praedico Notifications" <${ENV.EMAIL_USER}>`,
    to: institute.email,
    subject: '🔔 New Student Registration - Approval Required',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .content { background: #e3f2fd; padding: 30px; border-radius: 10px; border-left: 5px solid #2196F3; }
          .button { display: inline-block; padding: 12px 30px; background: #2196F3; color: white; text-decoration: none; border-radius: 5px; margin: 10px 5px; }
          .info-box { background: white; padding: 15px; border-radius: 5px; margin: 15px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="content">
            <h2 style="color: #1976D2;">📋 New Student Registration</h2>
            <div class="info-box">
              <p><strong>📧 Student Email:</strong> ${studentEmail}</p>
              <p><strong>👤 Student Name:</strong> ${studentName}</p>
              <p><strong>🏫 Institute:</strong> ${institute.organizationName}</p>
            </div>
            <p>A new student has registered and selected your institute. Please review and approve/reject their registration from your dashboard.</p>
            <center>
              <a href="${ENV.FRONTEND_URL}/institute/dashboard" class="button">View Dashboard</a>
            </center>
          </div>
        </div>
      </body>
      </html>
    `,
  });
};

// Student Approval Email
export const sendStudentApprovalEmail = async (email: string, name: string) => {
  await transporter.sendMail({
    from: `"Praedico Team" <${ENV.EMAIL_USER}>`,
    to: email,
    subject: '✅ Your Registration Has Been Approved!',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .content { background: #e8f5e9; padding: 30px; border-radius: 10px; border-left: 5px solid #4CAF50; }
          .button { display: inline-block; padding: 15px 40px; background: #4CAF50; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="content">
            <h2 style="color: #2E7D32;">🎉 Congratulations ${name}!</h2>
            <p>Great news! Your registration has been <strong>approved</strong> by your institute.</p>
            <p>You now have full access to Praedico's paper trading platform and can start your trading journey.</p>
            <center>
              <a href="${ENV.FRONTEND_URL}/login" class="button">Login & Start Trading</a>
            </center>
            <p style="margin-top: 20px;">Happy Trading! 🚀</p>
          </div>
        </div>
      </body>
      </html>
    `,
  });
};

// Student Rejection Email
export const sendStudentRejectionEmail = async (
  email: string, 
  name: string, 
  reason?: string
) => {
  await transporter.sendMail({
    from: `"Praedico Team" <${ENV.EMAIL_USER}>`,
    to: email,
    subject: '❌ Registration Status Update',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .content { background: #ffebee; padding: 30px; border-radius: 10px; border-left: 5px solid #f44336; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="content">
            <h2 style="color: #c62828;">Registration Status Update</h2>
            <p>Dear ${name},</p>
            <p>We regret to inform you that your registration was <strong>not approved</strong> by your institute.</p>
            ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
            <p>Please contact your institute administrator for more information or clarification.</p>
            <p>If you believe this is an error, please reach out to your institute directly.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  });
};
