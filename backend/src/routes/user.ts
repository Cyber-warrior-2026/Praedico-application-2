import { Router } from "express";
import { UserController } from "../controllers/user";
import { authorize } from "../common/guards/role.guard";

const router = Router();
const userController = new UserController();

router.post("/register", userController.register);
router.post("/verify", userController.verify);
router.post("/login", userController.login);
router.post("/forgot-password", userController.forgotPassword);
router.post("/reset-password", userController.resetPassword);
router.post("/logout", userController.logout);

router.get("/me", authorize(["user", "admin", "super_admin"]), userController.getMe);
// Admin-only routes for user management
router.get(
  "/all", 
  authorize(["admin", "super_admin"]), 
  userController.getAllUsers
);

router.get(
  "/stats", 
  authorize(["admin", "super_admin"]), 
  userController.getUserStats
);
router.patch(
  "/:id/toggle-active", 
  authorize(["admin", "super_admin"]), 
  userController.toggleUserActive
);

router.get(
  "/:id", 
  authorize(["admin", "super_admin"]), 
  userController.getUserById
);

router.put(
  "/:id", 
  authorize(["admin", "super_admin"]), 
  userController.updateUser
);

router.delete(
  "/:id", 
  authorize(["admin", "super_admin"]), 
  userController.deleteUser
);



export default router;
