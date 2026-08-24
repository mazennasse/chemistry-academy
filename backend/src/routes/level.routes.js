import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

import {
  getLevels,
  createLevel,
  updateLevel,
  deleteLevel
} from '../controllers/level.controller.js';

const router = Router();

router.get(
  '/',
  requireAuth,
  asyncHandler(getLevels)
);

router.post(
  '/',
  requireAuth,
  requireRole('admin'),
  asyncHandler(createLevel)
);

router.put(
  '/:id',
  requireAuth,
  requireRole('admin'),
  asyncHandler(updateLevel)
);

router.delete(
  '/:id',
  requireAuth,
  requireRole('admin'),
  asyncHandler(deleteLevel)
);

export default router;