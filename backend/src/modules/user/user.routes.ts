import { Router } from 'express';
import { UserController } from './user.controller';

const router = Router();
const userController = new UserController();

router.post('/register', userController.register);
router.post('/verify', userController.verifyAndSetPassword);
router.post('/login', userController.login);
router.post('/forgot-password', userController.forgotPassword);
router.post('/reset-password', userController.resetPassword);
router.post('/logout', userController.logout);

export default router;
