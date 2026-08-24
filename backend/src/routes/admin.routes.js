import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { dashboard } from '../controllers/admin.controller.js';

const router = Router();
router.get('/dashboard', requireAuth, requireRole('admin'), asyncHandler(dashboard));
export default router;
