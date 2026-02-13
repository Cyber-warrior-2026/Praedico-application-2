import { Router } from "express";
import { CoordinatorController } from "../controllers/coordinator";
import { authorize } from "../common/guards/role.guard";

const router = Router();
const coordinatorController = new CoordinatorController();

// ============================================
// PUBLIC ROUTES
// ============================================
router.post("/verify", coordinatorController.verify);
router.post("/login", coordinatorController.login);
router.post("/logout", coordinatorController.logout);

// ============================================
// PROTECTED COORDINATOR ROUTES
// ============================================
router.get("/me", authorize(["department_coordinator"]), coordinatorController.getMe);
router.get("/students", authorize(["department_coordinator"]), coordinatorController.getMyStudents);
router.get("/students/pending", authorize(["department_coordinator"]), coordinatorController.getPendingStudents);
router.patch("/students/:studentId/approve", authorize(["department_coordinator"]), coordinatorController.approveStudent);
router.patch("/students/:studentId/reject", authorize(["department_coordinator"]), coordinatorController.rejectStudent);

// ============================================
// ORGANIZATION ADMIN ROUTES (Manage Coordinators)
// ============================================
router.post("/", authorize(["organization_admin"]), coordinatorController.createCoordinator);
router.get("/all", authorize(["organization_admin"]), coordinatorController.getAllCoordinators);
router.delete("/:id", authorize(["organization_admin"]), coordinatorController.deleteCoordinator);

export default router;
