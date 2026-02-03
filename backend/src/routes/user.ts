import { Router } from "express";
import { UserController } from "../controllers/user";
import { authorize } from "../common/guards/role.guard";

const router = Router();
const userController = new UserController();

// Public Routes
router.post("/register", userController.register);
router.post("/verify", userController.verify);
router.post("/login", userController.login);
router.post("/forgot-password", userController.forgotPassword);
router.post("/reset-password", userController.resetPassword);
router.post("/logout", userController.logout);

// Protected User Routes
router.get("/me", authorize(["user", "admin", "super_admin"]), userController.getMe);

// ============================================
// ADMIN ROUTES
// ============================================

router.get("/all", authorize(["admin", "super_admin"]), userController.getAllUsers);
router.get("/stats", authorize(["admin", "super_admin"]), userController.getUserStats);
router.get("/:id", authorize(["admin", "super_admin"]), userController.getUserById);
router.put("/:id", authorize(["admin", "super_admin"]), userController.updateUser);

// Status Management
router.patch("/:id/toggle-active", authorize(["admin", "super_admin"]), userController.toggleUserActive);

// --- NEW: SOFT DELETE ROUTES ---
router.patch("/:id/soft-delete", authorize(["admin", "super_admin"]), userController.softDeleteUser);
router.patch("/:id/restore", authorize(["admin", "super_admin"]), userController.restoreUser);

// Hard Delete (Optional - keep if you still want permanent deletion capability)
router.delete("/:id", authorize(["super_admin"]), userController.deleteUser);

export default router;