import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { getCatalog } from '../controllers/catalog.controller.js';

const router = Router();

router.get(
  '/',
  requireAuth,
  requireRole('admin'),
  asyncHandler(getCatalog)
);

export default router;