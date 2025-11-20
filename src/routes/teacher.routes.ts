import { Router } from 'express';
import { TeacherController } from 'controllers/teacher.controller';
import { validateCreateTeacher } from 'middleware/validation/teachers/validateCreateTeacher';
import { catchAsync } from 'utils/catchAsync';

const router = Router();
const teacherController = new TeacherController();

router.post('/', validateCreateTeacher, catchAsync(teacherController.create.bind(teacherController)));
router.get('/', catchAsync(teacherController.findAll.bind(teacherController)));
router.get('/:id', catchAsync(teacherController.findOne.bind(teacherController)));
router.put('/:id', catchAsync(teacherController.update.bind(teacherController)));
router.delete('/:id', catchAsync(teacherController.remove.bind(teacherController)));

export default router;
