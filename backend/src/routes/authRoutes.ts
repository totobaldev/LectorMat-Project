import { Router } from 'express';
import { login, updateProfile } from '../controllers/authController';
import { authMiddleware } from '../middlewares/auth';

const router = Router();

router.post('/login', login);
router.put('/profile', authMiddleware, updateProfile);

export default router;
