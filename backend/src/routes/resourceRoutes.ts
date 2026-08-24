import { Router } from 'express';
import {
  getResources,
  downloadResource,
  createResource,
  updateResource,
  deleteResource,
} from '../controllers/resourceController';
import { authenticate, requireAdmin } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { resourceSchema } from '../validators/schemas';

const router = Router();

router.get('/', getResources);
router.post('/:id/download', downloadResource);

router.post('/', authenticate, requireAdmin, validate(resourceSchema), createResource);
router.put('/:id', authenticate, requireAdmin, validate(resourceSchema), updateResource);
router.delete('/:id', authenticate, requireAdmin, deleteResource);

export default router;
