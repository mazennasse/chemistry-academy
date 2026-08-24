import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

import {
  getSubjects,
  createSubject,
  updateSubject,
  deleteSubject
} from '../controllers/subject.controller.js';

const router = Router();

router.get(
  '/',
  requireAuth,
  asyncHandler(getSubjects)
);

router.post(
  '/',
  requireAuth,
  requireRole('admin'),
  asyncHandler(createSubject)
);

router.put(
  '/:id',
  requireAuth,
  requireRole('admin'),
  asyncHandler(updateSubject)
);

router.delete(
  '/:id',
  requireAuth,
  requireRole('admin'),
  asyncHandler(deleteSubject)
);

export default router;