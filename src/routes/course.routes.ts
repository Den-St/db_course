import { catchAsync } from 'utils/catchAsync';
import { Router } from 'express';
import { CourseController } from '../controllers/course.controller';

const router = Router();
const courseController = new CourseController();

router.post('/create', catchAsync(courseController.create));
router.patch('/assign-teacher', catchAsync(courseController.assignTeacher));
router.get('/teacher/:teacher_id', catchAsync(courseController.getCoursesByTeacher));
router.get('/student/:student_id', catchAsync(courseController.getCoursesByStudent));

export default router;
