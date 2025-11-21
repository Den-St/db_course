import { Router } from 'express';
import { TuitionFeeController } from '../controllers/tuitionFee.controller';
import { catchAsync } from 'utils/catchAsync';

const router = Router();
const tuitionFeeController = new TuitionFeeController();

router.post('/', catchAsync(tuitionFeeController.createTuitionFee));

export default router;
