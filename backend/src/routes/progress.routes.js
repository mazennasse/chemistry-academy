import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { completeLecture, getMyProgress } from '../controllers/progress.controller.js';

const router = Router();
router.use(requireAuth, requireRole('student'));
router.get('/me', asyncHandler(getMyProgress));
router.post('/:id/complete', asyncHandler(completeLecture));
export default router;
