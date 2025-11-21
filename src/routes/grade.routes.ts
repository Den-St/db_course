import { Router } from 'express';
import { GradeController } from '../controllers/grade.controller';
import { catchAsync } from 'utils/catchAsync';

const router = Router();
const gradeController = new GradeController();

router.post('/', catchAsync(gradeController.createGrade));
router.put('/:id', catchAsync(gradeController.updateGrade));
router.get('/group-average', catchAsync(gradeController.getGroupAverageGrade));
router.get('/student-range', catchAsync(gradeController.getStudentGradesInRange));

export default router;
