import { catchAsync } from 'utils/catchAsync';
import { Router } from 'express';
import { EnrollmentController } from '../controllers/enrollment.controller';

const router = Router();
const enrollmentController = new EnrollmentController();

router.post('/create', catchAsync(enrollmentController.create));

export default router;
