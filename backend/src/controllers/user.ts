import { Request, Response } from "express";
import { UserService } from "../services/user";
import { asyncHandler } from "../common/errors/errorHandler";
import { z } from "zod";
import { ENV } from "../config/env";

const userService = new UserService();

// 1. UPDATE: Add optional 'name' to the schema
const registerSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
   instituteId: z.string().optional(),
});

const verifySchema = z.object({
  token: z.string(),
  password: z.string().min(8),
});
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});
const forgotPasswordSchema = z.object({ email: z.string().email() });
const resetPasswordSchema = z.object({
  token: z.string(),
  newPassword: z.string().min(8),
});

export class UserController {
  register = asyncHandler(async (req: Request, res: Response) => {
    // 2. UPDATE: Parse 'name' and 'instituteId' from request body
     const { email, name, instituteId } = registerSchema.parse(req.body);  

    // 3. UPDATE: Pass 'name' and 'instituteId' to the service
    const result = await userService.register(email, name, instituteId);

    res.status(200).json({ success: true, ...result });
  });

  verify = asyncHandler(async (req: Request, res: Response) => {
    const { token, password } = verifySchema.parse(req.body);
    const result = await userService.verify(token, password);

    this.setAuthCookies(res, result.accessToken, result.refreshToken);

    res.status(200).json({ success: true, user: result.user });
  });

  login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = loginSchema.parse(req.body);
    const result = await userService.login(email, password);

    this.setAuthCookies(res, result.accessToken, result.refreshToken);

    res.status(200).json({ success: true, user: result.user });
  });

  getMe = asyncHandler(async (req: Request, res: Response) => {
    const tokenUser = (req as any).user;

    if (!tokenUser || !tokenUser.id) {
      res.status(401).json({ success: false, message: "Not authenticated" });
      return;
    }

    // Fetch fresh user data from database to get latest subscription info
    const user = await userService.getUserById(tokenUser.id);

    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    // Ensure a valid name is always returned
    const displayName =
      user.name && user.name !== "User" ? user.name : user.email.split("@")[0];

    // Check for Trial Expiry: If active trial date has passed, downgrade to Free immediately
    if (user.isOnTrial && user.trialEndDate && new Date(user.trialEndDate) < new Date()) {
      user.isOnTrial = false;
      user.currentPlan = 'Free';
      user.subscriptionStatus = 'expired';
      await user.save();
    }

    res.status(200).json({
      success: true,
      user: {
        id: user.id || user._id,
        email: user.email,
        role: user.role,
        name: displayName,
        // Subscription fields
        currentPlan: user.currentPlan || 'Free',
        subscriptionStatus: user.subscriptionStatus,
        subscriptionExpiry: user.subscriptionExpiry,
        subscriptionId: user.subscriptionId,
        // Trial fields
        hasUsedTrial: user.hasUsedTrial || false,
        isOnTrial: user.isOnTrial || false,
        trialEndDate: user.trialEndDate,
      },
    });
  });

  logout = asyncHandler(async (req: Request, res: Response) => {
    // Clear cookies with same settings to ensure they are actually removed
    const isProduction = process.env.NODE_ENV === "production";
    const cookieOptions = {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" as const : "lax" as const,
    };

    res.clearCookie("accessToken", cookieOptions);
    res.clearCookie("refreshToken", cookieOptions);
    res.status(200).json({ success: true, message: "Logged out" });
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

  // --- CRITICAL FIX FOR VERCEL ---
  private setAuthCookies(
    res: Response,
    accessToken: string,
    refreshToken: string,
  ) {
    const isProduction = process.env.NODE_ENV === "production";

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: isProduction, // Must be true on Vercel
      sameSite: isProduction ? "none" : "lax", // Must be 'none' for cross-site usage
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }

  // Get all users with pagination, search, and filter
  getAllUsers = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string || '';
    const role = req.query.role as string || '';
    const status = req.query.status as string || '';

    const result = await userService.getAllUsers({ 
      page, 
      limit, 
      search, 
      role, 
      status 
    });
    
    res.status(200).json({ success: true, ...result });
  });

  // Get user statistics
  getUserStats = asyncHandler(async (req: Request, res: Response) => {
    const stats = await userService.getUserStats();
    res.status(200).json({ success: true, stats });
  });

  // Get single user by ID
  getUserById = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.params.id as string;
    const user = await userService.getUserById(userId);
    res.status(200).json({ success: true, user });
  });

  // Update user
  updateUser = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.params.id as string;
    const updateData = req.body;
    const user = await userService.updateUser(userId, updateData);
    res.status(200).json({ success: true, user, message: "User updated successfully" });
  });

  softDeleteUser = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.params.id as string;
    await userService.softDeleteUser(userId);
    res.status(200).json({ success: true, message: "User archived successfully" });
  });

  // 2. Restore Handler
  restoreUser = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.params.id as string;
    await userService.restoreUser(userId);
    res.status(200).json({ success: true, message: "User restored successfully" });
  });

  // Delete user
  deleteUser = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.params.id as string;
    await userService.deleteUser(userId);
    res.status(200).json({ success: true, message: "User deleted successfully" });
  });

  // Toggle user active status
  toggleUserActive = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.params.id as string;
    const user = await userService.toggleUserActive(userId);
    res.status(200).json({ 
      success: true, 
      user, 
      message: `User ${user.isActive ? 'activated' : 'blocked'} successfully` 
    });
  });
}