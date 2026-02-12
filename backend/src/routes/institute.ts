import { Router } from "express";
import { InstituteController } from "../controllers/institute";
import { authorize } from "../common/guards/role.guard";

const router = Router();
const instituteController = new InstituteController();

// ============================================
// PUBLIC ROUTES
// ============================================
router.get("/public/list", instituteController.getPublicList);
router.post("/register", instituteController.register);
router.post("/verify", instituteController.verify);
router.post("/login", instituteController.login);
router.post("/forgot-password", instituteController.forgotPassword);
router.post("/reset-password", instituteController.resetPassword);
router.post("/logout", instituteController.logout);

// ============================================
// PROTECTED INSTITUTE ROUTES
// ============================================
router.get("/me", authorize(["institute"]), instituteController.getMe);
router.get("/students/pending", authorize(["institute"]), instituteController.getPendingStudents);
router.get("/students", authorize(["institute"]), instituteController.getStudents);
router.patch("/students/:studentId/approve", authorize(["institute"]), instituteController.approveStudent);
router.patch("/students/:studentId/reject", authorize(["institute"]), instituteController.rejectStudent);

// ============================================
// ADMIN ROUTES (To manage institutes)
// ============================================
router.get("/all", authorize(["admin", "super_admin"]), instituteController.getAllInstitutes);
router.patch("/:id/toggle-active", authorize(["admin", "super_admin"]), instituteController.toggleInstituteActive);

export default router;