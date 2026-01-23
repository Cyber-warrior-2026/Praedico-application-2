import { Request, Response } from 'express';
import { UserService } from './user.service';
import { asyncHandler } from '../../common/errors/errorHandler';
import { z } from 'zod';

const userService = new UserService();

const registerSchema = z.object({ email: z.string().email() });
const verifySchema = z.object({ token: z.string(), password: z.string().min(8) });
const loginSchema = z.object({ email: z.string().email(), password: z.string() });
const forgotPasswordSchema = z.object({ email: z.string().email() });
const resetPasswordSchema = z.object({ token: z.string(), newPassword: z.string().min(8) });

export class UserController {
  register = asyncHandler(async (req: Request, res: Response) => {
    const { email } = registerSchema.parse(req.body);
    const result = await userService.registerUser(email);
    res.status(200).json({ success: true, ...result });
  });

  verifyAndSetPassword = asyncHandler(async (req: Request, res: Response) => {
    const { token, password } = verifySchema.parse(req.body);
    const result = await userService.verifyEmailAndSetPassword(token, password);
    res.status(200).json({ success: true, ...result });
  });

  login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = loginSchema.parse(req.body);
    const result = await userService.loginUser(email, password);
    
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });
    
    res.status(200).json({ 
      success: true, 
      accessToken: result.accessToken, 
      user: result.user 
    });
  });

  forgotPassword = asyncHandler(async (req: Request, res: Response) => {
    const { email } = forgotPasswordSchema.parse(req.body);
    const result = await userService.forgotPassword(email);
    res.status(200).json({ success: true, ...result });
  });

  resetPassword = asyncHandler(async (req: Request, res: Response) => {
    const { token, newPassword } = resetPasswordSchema.parse(req.body);
    const result = await userService.resetPassword(token, newPassword);
    res.status(200).json({ success: true, ...result });
  });

  logout = asyncHandler(async (req: Request, res: Response) => {
    res.clearCookie('refreshToken');
    res.status(200).json({ success: true, message: 'Logged out' });
  });
}
