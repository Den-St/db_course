import { Router } from 'express';
import { AssignmentFeedbackController } from '../controllers/assignmentFeedback.controller';
import { catchAsync } from 'utils/catchAsync';

const router = Router();
const feedbackController = new AssignmentFeedbackController();

router.post('/', catchAsync(feedbackController.createFeedback));
router.put('/:id', catchAsync(feedbackController.updateFeedback));
router.get('/submission/:submission_id', catchAsync(feedbackController.getFeedbackBySubmission));
router.get('/student-range', catchAsync(feedbackController.getStudentFeedbacksInRange));
router.delete('/:id', catchAsync(feedbackController.deleteFeedback));

export default router;