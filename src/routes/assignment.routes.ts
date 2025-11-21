import { Router } from 'express';
import { AssignmentController } from '../controllers/assignment.controller';
import { catchAsync } from 'utils/catchAsync';

const router = Router();
const assignmentController = new AssignmentController();

router.post('/create', catchAsync(assignmentController.createAssignment));
router.get('/student-group', catchAsync(assignmentController.getAssignmentsForStudentGroup));

export default router;
