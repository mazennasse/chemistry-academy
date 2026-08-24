import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { signature } from '../controllers/upload.controller.js';

const router = Router();
router.get('/signature', requireAuth, requireRole('admin'), asyncHandler(signature));
export default router;
