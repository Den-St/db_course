import { Router } from 'express';
import { SubmissionController } from '../controllers/submission.controller';
import { catchAsync } from 'utils/catchAsync';

const router = Router();
const submissionController = new SubmissionController();

router.post('/create', catchAsync(submissionController.createSubmission));
router.post('/filter', catchAsync(submissionController.filterSubmissions));

export default router;
