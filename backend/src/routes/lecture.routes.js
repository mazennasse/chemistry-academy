import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { listPublicLectures, listStudentLectures, getLectureForStudent, listAdminLectures, createLecture, updateLecture, deleteLecture } from '../controllers/lecture.controller.js';

const router = Router();
router.get('/public', asyncHandler(listPublicLectures));
router.get('/student', requireAuth, requireRole('student'), asyncHandler(listStudentLectures));
router.get('/student/:id', requireAuth, requireRole('student'), asyncHandler(getLectureForStudent));
router.get('/admin', requireAuth, requireRole('admin'), asyncHandler(listAdminLectures));
router.post('/', requireAuth, requireRole('admin'), asyncHandler(createLecture));
router.patch('/:id', requireAuth, requireRole('admin'), asyncHandler(updateLecture));
router.delete('/:id', requireAuth, requireRole('admin'), asyncHandler(deleteLecture));
export default router;
