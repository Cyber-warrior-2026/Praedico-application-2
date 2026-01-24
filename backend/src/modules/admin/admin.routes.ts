import { Router } from 'express';
import { loginAdmin, createFirstAdmin } from './admin.controller';
import { AdminGhostGuard } from '../../common/guards/admin.guard';

const router = Router();


router.use(AdminGhostGuard); 

router.post('/login', loginAdmin);
router.post('/create', createFirstAdmin);

export default router;