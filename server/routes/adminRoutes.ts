import { Router } from 'express';
import { getAdminStats, getCategories, createCategory, deleteCategory } from '../controllers/adminController';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();

router.get('/stats', authenticate, requireAdmin, getAdminStats);
router.get('/categories', authenticate, requireAdmin, getCategories);
router.post('/categories', authenticate, requireAdmin, createCategory);
router.delete('/categories/:id', authenticate, requireAdmin, deleteCategory);

export default router;
