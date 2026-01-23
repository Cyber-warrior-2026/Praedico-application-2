import { Request, Response } from 'express';
import { UserService } from './user.service';
import { asyncHandler } from '../../common/errors/errorHandler'; // Ensure this path is correct
import { z } from 'zod';

const userService = new UserService();

// --- Validation Schemas ---
const registerSchema = z.object({ email: z.string().email() });
const verifySchema = z.object({ token: z.string(), password: z.string().min(8) });
const loginSchema = z.object({ email: z.string().email(), password: z.string() });
const forgotPasswordSchema = z.object({ email: z.string().email() });
const resetPasswordSchema = z.object({ token: z.string(), newPassword: z.string().min(8) });

export class UserController {
  
  // 1. Register
  register = asyncHandler(async (req: Request, res: Response) => {
    const { email } = registerSchema.parse(req.body);
    const result = await userService.register(email);
    res.status(200).json({ success: true, ...result });
  });

  // 2. Verify Email (Set Password)
  verify = asyncHandler(async (req: Request, res: Response) => {
    const { token, password } = verifySchema.parse(req.body);
    const result = await userService.verify(token, password);
    
    // Set Refresh Token Cookie
    this.setRefreshCookie(res, result.refreshToken);

    res.status(200).json({ 
      success: true, 
      accessToken: result.accessToken, 
      user: result.user 
    });
  });

  // 3. Login
  login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = loginSchema.parse(req.body);
    const result = await userService.login(email, password);
    
    // Set Refresh Token Cookie
    this.setRefreshCookie(res, result.refreshToken);
    
    res.status(200).json({ 
      success: true, 
      accessToken: result.accessToken, 
      user: result.user 
    });
  });

  // 4. Forgot Password
  forgotPassword = asyncHandler(async (req: Request, res: Response) => {
    const { email } = forgotPasswordSchema.parse(req.body);
    const result = await userService.forgotPassword(email);
    res.status(200).json({ success: true, ...result });
  });

  // 5. Reset Password
  resetPassword = asyncHandler(async (req: Request, res: Response) => {
    const { token, newPassword } = resetPasswordSchema.parse(req.body);
    const result = await userService.resetPassword(token, newPassword);
    res.status(200).json({ success: true, ...result });
  });

  // 6. Logout
  logout = asyncHandler(async (req: Request, res: Response) => {
    res.clearCookie('refreshToken');
    res.status(200).json({ success: true, message: 'Logged out' });
  });

  // --- Helper: Set Cookie ---
  private setRefreshCookie(res: Response, token: string) {
    res.cookie('refreshToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 Days
    });
  }
}