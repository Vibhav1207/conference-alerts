import { Router } from 'express';
import { register, login, getMe, toggleBookmark } from '../controllers/authController';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { registerSchema, loginSchema } from '../validators/schemas';

const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.get('/me', authenticate, getMe);
router.post('/bookmarks/:conferenceId', authenticate, toggleBookmark);

export default router;
