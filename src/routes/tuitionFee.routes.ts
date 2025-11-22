import { Router } from 'express';
import { TuitionFeeController } from '../controllers/tuitionFee.controller';
import { catchAsync } from 'utils/catchAsync';

const router = Router();
const tuitionFeeController = new TuitionFeeController();

router.post('/', catchAsync(tuitionFeeController.createTuitionFee));
router.post('/by-group', catchAsync(tuitionFeeController.createTuitionFeeByGroup));
router.get('/student-range', catchAsync(tuitionFeeController.getTuitionFeesByStudentInRange));
router.get('/group', catchAsync(tuitionFeeController.getTuitionFeesByGroup));
router.get('/overdue', catchAsync(tuitionFeeController.getOverdueTuitionFees));

export default router;
