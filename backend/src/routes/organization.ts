import { Router } from "express";
import { OrganizationController } from "../controllers/organization";
import { authorize } from "../common/guards/role.guard";

const router = Router();
const organizationController = new OrganizationController();

// ============================================
// PUBLIC ROUTES
// ============================================
router.get("/public/list", organizationController.getPublicList);
router.post("/register", organizationController.register);
router.post("/verify", organizationController.verify);
router.post("/login", organizationController.login);
router.post("/logout", organizationController.logout);

// ============================================
// PROTECTED ORGANIZATION ADMIN ROUTES
// ============================================
router.get("/me", authorize(["organization_admin"]), organizationController.getMe);
router.get("/stats", authorize(["organization_admin"]), organizationController.getStats);
router.post("/admins", authorize(["organization_admin"]), organizationController.createAdmin);
router.get("/students/pending", authorize(["organization_admin"]), organizationController.getPendingStudents);
router.get("/students", authorize(["organization_admin"]), organizationController.getStudents);
router.patch("/students/:studentId/approve", authorize(["organization_admin"]), organizationController.approveStudent);
router.patch("/students/:studentId/reject", authorize(["organization_admin"]), organizationController.rejectStudent);

// ============================================
// PLATFORM ADMIN ROUTES (Manage Organizations)
// ============================================
router.get("/all", authorize(["admin", "super_admin"]), organizationController.getAllOrganizations);
router.patch("/:id/toggle-active", authorize(["admin", "super_admin"]), organizationController.toggleOrganizationActive);

export default router;
