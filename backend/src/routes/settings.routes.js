import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { getSettings, updateSettings, removeTeacherImage } from '../controllers/settings.controller.js';

const router = Router();
router.get('/', asyncHandler(getSettings));
router.put('/', requireAuth, requireRole('admin'), asyncHandler(updateSettings));
router.delete('/teacher-image', requireAuth, requireRole('admin'), asyncHandler(removeTeacherImage));
export default router;
