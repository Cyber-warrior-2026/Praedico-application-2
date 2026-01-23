import { Router } from 'express';
import { loginAdmin, createFirstAdmin } from './admin.controller';
import { AdminGhostGuard } from '../../common/guards/admin.guard';

const router = Router();

// Apply Ghost Guard to ALL admin routes
router.use(AdminGhostGuard); 

router.post('/login', loginAdmin);
router.post('/create', createFirstAdmin); // Use this once via Postman to make your account, then delete it or protect it further.

export default router;