import { Router } from 'express';
import { saveProgress, getMyProgress } from '../controllers/progressController';
import { authMiddleware } from '../middlewares/auth';

const router = Router();

// All progress routes require authentication
router.use(authMiddleware);

router.post('/', saveProgress);
router.get('/me', getMyProgress);

export default router;
