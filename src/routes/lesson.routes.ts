import { Router } from 'express';
import { LessonController } from '../controllers/lesson.controller';
import { catchAsync } from 'utils/catchAsync';

const router = Router();
const lessonController = new LessonController();

router.post('/create', catchAsync(lessonController.createLesson));
router.get('/student', catchAsync(lessonController.getLessonsForStudent));

export default router;
