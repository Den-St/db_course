import { Router } from 'express';

import { catchAsync } from 'utils/catchAsync';

import { assignParent } from '../controllers/students/assignParent';
import { createStudent } from '../controllers/students/createStudent';
import { deleteStudent } from '../controllers/students/deleteStudent';
import { findAllStudents } from '../controllers/students/findAllStudents';
import { findOneStudent } from '../controllers/students/findOneStudent';
import { findStudentsByParent } from '../controllers/students/findStudentsByParent';
import { findStudentsWithoutParent } from '../controllers/students/findStudentsWithoutParent';
import { validateCreateStudent } from '../middleware/validation/students/validateCreateStudent';
import { searchStudents } from 'controllers/students/searchStudents';

const router = Router();

router.post('/', validateCreateStudent, catchAsync(createStudent));
router.get('/', catchAsync(findAllStudents));
router.post('/assign-parent', catchAsync(assignParent));
router.post('/search', catchAsync(searchStudents));
router.get('/without-parent', catchAsync(findStudentsWithoutParent));
router.get('/by-parent', catchAsync(findStudentsByParent));
router.get('/:id', catchAsync(findOneStudent));
router.delete('/:id', catchAsync(deleteStudent));

export { router as studentRoutes };
