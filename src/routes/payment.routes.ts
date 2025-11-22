import { Router } from 'express';
import { PaymentController } from '../controllers/payment.controller';
import { catchAsync } from 'utils/catchAsync';

const router = Router();
const paymentController = new PaymentController();

router.post('/', catchAsync(paymentController.createPayment));
router.get('/student-range', catchAsync(paymentController.getPaymentsByStudentInRange));

export default router;
