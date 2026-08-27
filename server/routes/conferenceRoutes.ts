import { Router } from 'express';
import {
  getConferences,
  getConferenceById,
  createConference,
  updateConference,
  updateConferenceStatus,
  deleteConference,
} from '../controllers/conferenceController';
import { getPublicCategories } from '../controllers/adminController';
import { authenticate, requireAdmin } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { conferenceSchema } from '../validators/schemas';

const router = Router();

router.get('/categories', getPublicCategories);
router.get('/', getConferences);
router.get('/admin', authenticate, requireAdmin, getConferences);
router.get('/:id', getConferenceById);

router.post('/', authenticate, validate(conferenceSchema), createConference);
router.put('/:id', authenticate, requireAdmin, validate(conferenceSchema), updateConference);
router.patch('/:id/status', authenticate, requireAdmin, updateConferenceStatus);
router.delete('/:id', authenticate, requireAdmin, deleteConference);

export default router;
