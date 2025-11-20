import { Router } from 'express';
import { LessonController } from '../controllers/lesson.controller';
import { catchAsync } from 'utils/catchAsync';

const router = Router();
const lessonController = new LessonController();

router.post('/create', catchAsync(lessonController.createLesson));

export default router;
