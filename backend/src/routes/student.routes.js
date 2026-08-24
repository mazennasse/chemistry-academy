import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { listStudents, createStudent, updateStudent, changeStudentPassword, deleteStudent } from '../controllers/student.controller.js';

const router = Router();
router.use(requireAuth, requireRole('admin'));
router.get('/', asyncHandler(listStudents));
router.post('/', asyncHandler(createStudent));
router.patch('/:id', asyncHandler(updateStudent));
router.patch('/:id/password', asyncHandler(changeStudentPassword));
router.delete('/:id', asyncHandler(deleteStudent));
export default router;
