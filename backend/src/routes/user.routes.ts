import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { authorize } from "../common/guards/role.guard";

const router = Router();
const userController = new UserController();

router.post("/register", userController.register);
router.post("/verify", userController.verify);
router.post("/login", userController.login);
router.post("/forgot-password", userController.forgotPassword);
router.post("/reset-password", userController.resetPassword);
router.post("/logout", userController.logout);

router.get(
  "/me",
  authorize(["user", "admin", "super_admin"]),
  userController.getMe,
);

export default router;
