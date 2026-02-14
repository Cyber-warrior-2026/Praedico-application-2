import { Request, Response } from "express";
import { CoordinatorService } from "../services/coordinator";
import { asyncHandler } from "../common/errors/errorHandler";
import { z } from "zod";

const coordinatorService = new CoordinatorService();

const createCoordinatorSchema = z.object({
  departmentId: z.string(),
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  mobile: z.string().min(10, "Valid mobile number is required"),
  designation: z.enum(['hod', 'faculty', 'coordinator', 'other'])
});

const verifySchema = z.object({
  token: z.string(),
  password: z.string().min(8, "Password must be at least 8 characters")
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

const approveRejectSchema = z.object({
  reason: z.string().optional()
});

const addStudentSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Valid email is required")
});

const importCSVSchema = z.object({
  students: z.array(z.object({
    name: z.string(),
    email: z.string(),
    organization: z.string().optional(),
    department: z.string().optional()
  }))
});


export class CoordinatorController {

  // Create Coordinator (by Organization Admin)
  createCoordinator = asyncHandler(async (req: Request, res: Response) => {
    const organizationId = (req as any).user.organization;
    const data = createCoordinatorSchema.parse(req.body);

    const result = await coordinatorService.createCoordinator({
      organizationId,
      ...data
    });

    res.status(201).json({ success: true, ...result });
  });

  // Verify Coordinator Email & Set Password
  verify = asyncHandler(async (req: Request, res: Response) => {
    const { token, password } = verifySchema.parse(req.body);
    const result = await coordinatorService.verify(token, password);

    this.setAuthCookies(res, result.accessToken, result.refreshToken);
    res.status(200).json({
      success: true,
      coordinator: result.coordinator
    });
  });

  // Login Coordinator
  login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = loginSchema.parse(req.body);
    const result = await coordinatorService.login(email, password);

    this.setAuthCookies(res, result.accessToken, result.refreshToken);
    res.status(200).json({
      success: true,
      coordinator: result.coordinator
    });
  });

  // Get Coordinator Profile
  getMe = asyncHandler(async (req: Request, res: Response) => {
    const coordinatorId = (req as any).user.id;

    const coordinator = await coordinatorService.getCoordinatorById(coordinatorId);
    res.status(200).json({ success: true, coordinator });
  });

  // Get Students in My Department
  getMyStudents = asyncHandler(async (req: Request, res: Response) => {
    const coordinatorId = (req as any).user.id;
    const status = req.query.status as string | undefined;

    const students = await coordinatorService.getMyDepartmentStudents(coordinatorId, status);
    res.status(200).json({
      success: true,
      students,
      count: students.length
    });
  });

  // Get Pending Approvals
  getPendingStudents = asyncHandler(async (req: Request, res: Response) => {
    const coordinatorId = (req as any).user.id;

    const students = await coordinatorService.getPendingStudents(coordinatorId);
    res.status(200).json({
      success: true,
      students,
      count: students.length
    });
  });

  // Approve Student
  approveStudent = asyncHandler(async (req: Request, res: Response) => {
    const coordinatorId = (req as any).user.id;
    const studentId = req.params.studentId as string;

    const result = await coordinatorService.approveStudent(coordinatorId, studentId);
    res.status(200).json({ success: true, ...result });
  });

  // Reject Student
  rejectStudent = asyncHandler(async (req: Request, res: Response) => {
    const coordinatorId = (req as any).user.id;
    const studentId = req.params.studentId as string;
    const { reason } = approveRejectSchema.parse(req.body);

    const result = await coordinatorService.rejectStudent(coordinatorId, studentId, reason);
    res.status(200).json({ success: true, ...result });
  });

  // Add Student Directly (No Approval Needed)
  addStudent = asyncHandler(async (req: Request, res: Response) => {
    const coordinatorId = (req as any).user.id;
    const { name, email } = addStudentSchema.parse(req.body);

    const result = await coordinatorService.addStudentDirectly(coordinatorId, { name, email });
    res.status(201).json({ success: true, ...result });
  });

  // Import Students from CSV
  importStudentsCSV = asyncHandler(async (req: Request, res: Response) => {
    const coordinatorId = (req as any).user.id;
    const { students } = importCSVSchema.parse(req.body);

    const result = await coordinatorService.importStudentsFromCSV(coordinatorId, students);
    res.status(200).json({ success: true, ...result });
  });

  // Logout
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

  // Get All Coordinators (by Org Admin)
  getAllCoordinators = asyncHandler(async (req: Request, res: Response) => {
    const organizationId = (req as any).user.organization;

    const coordinators = await coordinatorService.getCoordinatorsByOrganization(organizationId);
    res.status(200).json({
      success: true,
      coordinators,
      count: coordinators.length
    });
  });

  // Delete Coordinator (by Org Admin)
  deleteCoordinator = asyncHandler(async (req: Request, res: Response) => {
    const organizationId = (req as any).user.organization;
    const coordinatorId = req.params.id as string;

    const result = await coordinatorService.deleteCoordinator(coordinatorId, organizationId);
    res.status(200).json({ success: true, ...result });
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
}
