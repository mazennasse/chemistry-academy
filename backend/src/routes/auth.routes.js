import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { requireAuth } from '../middleware/auth.js';
import { login, me, changeMyPassword } from '../controllers/auth.controller.js';

const router = Router();
router.post('/login', asyncHandler(login));
router.get('/me', requireAuth, asyncHandler(me));
router.post('/change-password', requireAuth, asyncHandler(changeMyPassword));
export default router;
