import { Request, Response } from "express";
import { InstituteService } from "../services/institute";
import { asyncHandler } from "../common/errors/errorHandler";
import { z } from "zod";

const instituteService = new InstituteService();

const registerSchema = z.object({
  organizationName: z.string().min(2, "Organization name is required"),
  contactPerson: z.string().min(2, "Contact person is required"),
  address: z.string().min(5, "Address is required"),
  email: z.string().email("Valid email is required"),
  mobile: z.string().min(10, "Valid mobile number is required"),
  website: z.string().url().optional().or(z.literal('')),
});

const verifySchema = z.object({
  token: z.string(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const approveRejectSchema = z.object({
  reason: z.string().optional(),
});

const forgotPasswordSchema = z.object({ 
  email: z.string().email() 
});

const resetPasswordSchema = z.object({
  token: z.string(),
  newPassword: z.string().min(8),
});

export class InstituteController {
  
  register = asyncHandler(async (req: Request, res: Response) => {
    const data = registerSchema.parse(req.body);
    const result = await instituteService.register(data);
    res.status(200).json({ success: true, ...result });
  });

  verify = asyncHandler(async (req: Request, res: Response) => {
    const { token, password } = verifySchema.parse(req.body);
    const result = await instituteService.verify(token, password);
    this.setAuthCookies(res, result.accessToken, result.refreshToken);
    res.status(200).json({ success: true, institute: result.institute });
  });

  login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = loginSchema.parse(req.body);
    const result = await instituteService.login(email, password);
    this.setAuthCookies(res, result.accessToken, result.refreshToken);
    res.status(200).json({ success: true, institute: result.institute });
  });

  getMe = asyncHandler(async (req: Request, res: Response) => {
    const tokenInstitute = (req as any).user;
    
    if (!tokenInstitute || !tokenInstitute.id) {
      res.status(401).json({ success: false, message: "Not authenticated" });
      return;
    }

    const institute = await instituteService.getInstituteById(tokenInstitute.id);
    res.status(200).json({ success: true, institute });
  });

  getPendingStudents = asyncHandler(async (req: Request, res: Response) => {
    const instituteId = (req as any).user.id;
    const students = await instituteService.getPendingStudents(instituteId);
    res.status(200).json({ success: true, students, count: students.length });
  });

  approveStudent = asyncHandler(async (req: Request, res: Response) => {
    const instituteId = (req as any).user.id;
    const studentId = req.params.studentId as string;
    const result = await instituteService.approveStudent(instituteId, studentId);
    res.status(200).json({ success: true, ...result });
  });

  rejectStudent = asyncHandler(async (req: Request, res: Response) => {
    const instituteId = (req as any).user.id;
    const studentId = req.params.studentId as string;
    const { reason } = approveRejectSchema.parse(req.body);
    const result = await instituteService.rejectStudent(instituteId, studentId, reason);
    res.status(200).json({ success: true, ...result });
  });

  getStudents = asyncHandler(async (req: Request, res: Response) => {
    const instituteId = (req as any).user.id;
    const status = req.query.status as string | undefined;
    const students = await instituteService.getStudents(instituteId, status);
    res.status(200).json({ success: true, students, count: students.length });
  });

  forgotPassword = asyncHandler(async (req: Request, res: Response) => {
    const { email } = forgotPasswordSchema.parse(req.body);
    const result = await instituteService.forgotPassword(email);
    res.status(200).json({ success: true, ...result });
  });

  resetPassword = asyncHandler(async (req: Request, res: Response) => {
    const { token, newPassword } = resetPasswordSchema.parse(req.body);
    const result = await instituteService.resetPassword(token, newPassword);
    res.status(200).json({ success: true, ...result });
  });

  logout = asyncHandler(async (req: Request, res: Response) => {
    const isProduction = process.env.NODE_ENV === "production";
    const cookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? ("none" as const) : ("lax" as const),
    };

    res.clearCookie("accessToken", cookieOptions);
    res.clearCookie("refreshToken", cookieOptions);
    res.status(200).json({ success: true, message: "Logged out" });
  });

  private setAuthCookies(res: Response, accessToken: string, refreshToken: string) {
    const isProduction = process.env.NODE_ENV === "production";

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }

  // Admin endpoints to manage institutes
  getAllInstitutes = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string || '';
    
    const result = await instituteService.getAllInstitutes({ page, limit, search });
    res.status(200).json({ success: true, ...result });
  });

  toggleInstituteActive = asyncHandler(async (req: Request, res: Response) => {
    const instituteId = req.params.id as string;
    const institute = await instituteService.toggleInstituteActive(instituteId);
    res.status(200).json({
      success: true,
      institute,
      message: `Institute ${institute.isActive ? 'activated' : 'deactivated'} successfully`
    });
  });
  // Public list for registration
  getPublicList = asyncHandler(async (req: Request, res: Response) => {
    const institutes = await instituteService.getPublicList();
    res.status(200).json({ success: true, institutes });
  });
}