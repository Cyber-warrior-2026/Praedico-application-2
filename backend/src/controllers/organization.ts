import { Request, Response } from "express";
import { OrganizationService } from "../services/organization";
import { asyncHandler } from "../common/errors/errorHandler";
import { z } from "zod";



const organizationService = new OrganizationService();

const registerSchema = z.object({
  organizationName: z.string().min(2, "Organization name is required"),
  organizationType: z.enum(['university', 'college', 'institute', 'school', 'other']),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  pincode: z.string().min(5, "Pincode is required"),
  country: z.string().optional(),
  contactEmail: z.string().email("Valid email is required"),
  contactPhone: z.string().min(10, "Valid phone number is required"),
  website: z.string().url().optional().or(z.literal('')),
  registeredBy: z.object({
    name: z.string().min(2, "Name is required"),
    email: z.string().email("Valid email is required"),
    designation: z.string().min(2, "Designation is required")
  })
});

const verifySchema = z.object({
  token: z.string(),
  password: z.string().min(8, "Password must be at least 8 characters")
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

const createAdminSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  mobile: z.string().min(10, "Valid mobile number is required"),
  designation: z.enum(['dean', 'director', 'principal', 'admin', 'other'])
});

const approveRejectSchema = z.object({
  reason: z.string().optional()
});

const addStudentSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Valid email is required"),
  departmentId: z.string().min(1, "Department is required")
});

const importCSVSchema = z.object({
  students: z.array(z.object({
    name: z.string(),
    email: z.string(),
    department: z.string()
  }))
});

const updateStudentSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  email: z.string().email("Valid email is required").optional()
});




export class OrganizationController {

  register = asyncHandler(async (req: Request, res: Response) => {
    const data = registerSchema.parse(req.body);
    const result = await organizationService.register(data);
    res.status(200).json({ success: true, ...result });
  });

  verify = asyncHandler(async (req: Request, res: Response) => {
    const { token, password } = verifySchema.parse(req.body);
    const result = await organizationService.verify(token, password);
    this.setAuthCookies(res, result.accessToken, result.refreshToken);
    res.status(200).json({
      success: true,
      organization: result.organization,
      admin: result.admin
    });
  });

  login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = loginSchema.parse(req.body);
    const result = await organizationService.login(email, password);
    this.setAuthCookies(res, result.accessToken, result.refreshToken);
    res.status(200).json({
      success: true,
      organization: result.organization,
      admin: result.admin
    });
  });

  getMe = asyncHandler(async (req: Request, res: Response) => {
    const adminId = (req as any).user.id;

    const result = await organizationService.getAdminById(adminId);
    res.status(200).json({ success: true, ...result });
  });

  // Create Additional Admin
  createAdmin = asyncHandler(async (req: Request, res: Response) => {
    const organizationId = (req as any).user.organization;
    const data = createAdminSchema.parse(req.body);

    const result = await organizationService.createAdmin(organizationId, data);
    res.status(201).json({ success: true, ...result });
  });

  // Get Organization Statistics
  getStats = asyncHandler(async (req: Request, res: Response) => {
    const organizationId = (req as any).user.organization;
    const stats = await organizationService.getOrganizationStats(organizationId);

    res.status(200).json({ success: true, ...stats });
  });

  getPendingStudents = asyncHandler(async (req: Request, res: Response) => {
    const organizationId = (req as any).user.organization;

    const students = await organizationService.getPendingStudents(organizationId);
    res.status(200).json({ success: true, students, count: students.length });
  });

  approveStudent = asyncHandler(async (req: Request, res: Response) => {
    const adminId = (req as any).user.id;
    const studentId = req.params.studentId as string;

    const result = await organizationService.approveStudent(adminId, studentId);
    res.status(200).json({ success: true, ...result });
  });

  rejectStudent = asyncHandler(async (req: Request, res: Response) => {
    const adminId = (req as any).user.id;
    const studentId = req.params.studentId as string;
    const { reason } = approveRejectSchema.parse(req.body);

    const result = await organizationService.rejectStudent(adminId, studentId, reason);
    res.status(200).json({ success: true, ...result });
  });

  getStudents = asyncHandler(async (req: Request, res: Response) => {
    const organizationId = (req as any).user.organization;
    const status = req.query.status as string | undefined;
    const departmentId = req.query.departmentId as string | undefined;

    const students = await organizationService.getStudents(organizationId, {
      status,
      departmentId
    });
    res.status(200).json({ success: true, students, count: students.length });
  });

  // Add Student Directly (No Approval Needed)
  addStudent = asyncHandler(async (req: Request, res: Response) => {
    const adminId = (req as any).user.id;
    const { name, email, departmentId } = addStudentSchema.parse(req.body);

    const result = await organizationService.addStudentDirectly(adminId, { name, email, departmentId });
    res.status(201).json({ success: true, ...result });
  });

  // Import Students from CSV
  importStudentsCSV = asyncHandler(async (req: Request, res: Response) => {
    const adminId = (req as any).user.id;
    const { students } = importCSVSchema.parse(req.body);

    const result = await organizationService.importStudentsFromCSV(adminId, students);
    res.status(200).json({ success: true, ...result });
  });

  // Get Student by ID
  getStudentById = asyncHandler(async (req: Request, res: Response) => {
    const organizationId = (req as any).user.organization;
    const studentId = req.params.studentId as string;

    const student = await organizationService.getStudentById(organizationId, studentId);
    res.status(200).json({ success: true, student });
  });

  // Update Student
  updateStudent = asyncHandler(async (req: Request, res: Response) => {
    const adminId = (req as any).user.id;
    const studentId = req.params.studentId as string;
    const updateData = updateStudentSchema.parse(req.body);

    const result = await organizationService.updateStudent(adminId, studentId, updateData);
    res.status(200).json({ success: true, ...result });
  });

  // Archive Student (Soft Delete)
  archiveStudent = asyncHandler(async (req: Request, res: Response) => {
    const adminId = (req as any).user.id;
    const studentId = req.params.studentId as string;

    const result = await organizationService.archiveStudent(adminId, studentId);
    res.status(200).json({ success: true, ...result });
  });

  // Unarchive Student
  unarchiveStudent = asyncHandler(async (req: Request, res: Response) => {
    const adminId = (req as any).user.id;
    const studentId = req.params.studentId as string;

    const result = await organizationService.unarchiveStudent(adminId, studentId);
    res.status(200).json({ success: true, ...result });
  });

  // Get Student Portfolio
  getStudentPortfolio = asyncHandler(async (req: Request, res: Response) => {
    const organizationId = (req as any).user.organization;
    const studentId = req.params.studentId as string;

    const portfolio = await organizationService.getStudentPortfolio(organizationId, studentId);
    res.status(200).json({ success: true, portfolio });
  });


  logout = asyncHandler(async (req: Request, res: Response) => {
    const isProduction = process.env.NODE_ENV === "production";
    const cookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? ("none" as const) : ("lax" as const)
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
      maxAge: 15 * 60 * 1000
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });
  }

  // Admin endpoints to manage organizations (Platform Admin)
  getAllOrganizations = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string || '';

    const result = await organizationService.getAllOrganizations({ page, limit, search });
    res.status(200).json({ success: true, ...result });
  });

  toggleOrganizationActive = asyncHandler(async (req: Request, res: Response) => {
    const organizationId = req.params.id as string;

    const organization = await organizationService.toggleOrganizationActive(organizationId);
    res.status(200).json({
      success: true,
      organization,
      message: `Organization ${organization.isActive ? 'activated' : 'deactivated'} successfully`
    });
  });

  // Public list for registration
  getPublicList = asyncHandler(async (req: Request, res: Response) => {
    const organizations = await organizationService.getPublicList();
    res.status(200).json({ success: true, organizations });
  });
}
