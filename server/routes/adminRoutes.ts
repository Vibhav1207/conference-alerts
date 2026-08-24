import { Router } from 'express';
import { getAdminStats } from '../controllers/adminController';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();

router.get('/stats', authenticate, requireAdmin, getAdminStats);

export default router;
