import { Request, Response } from 'express';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { PaymentService } from '../services/payment.service';
import { CreatePaymentDto } from '../dto/CreatePayment.dto';
import { GetPaymentsByStudentInRangeDto } from '../dto/GetPaymentsByStudentInRange.dto';

export class PaymentController {
  private paymentService: PaymentService;

  constructor() {
    this.paymentService = new PaymentService();
  }

  createPayment = async (req: Request, res: Response): Promise<void> => {
    try {
      const createPaymentDto = plainToClass(CreatePaymentDto, req.body);

      const errors = await validate(createPaymentDto);
      if (errors.length > 0) {
        const errorMessages = errors.map(error => 
          Object.values(error.constraints || {})
        ).flat();
        res.status(400).json({ 
          success: false,
          errors: errorMessages
        });
        return;
      }

      const payment = await this.paymentService.createPayment(createPaymentDto);

      res.status(201).json({
        success: true,
        data: payment,
        message: 'Payment created successfully'
      });
    } catch (error) {
      const status = error.message.includes('not found') ? 404 : 500;
      res.status(status).json({
        success: false,
        message: error.message || 'Failed to create payment'
      });
    }
  };

  getPaymentsByStudentInRange = async (req: Request, res: Response): Promise<void> => {
    try {
      const getPaymentsDto = plainToClass(GetPaymentsByStudentInRangeDto, req.query);

      const errors = await validate(getPaymentsDto);
      if (errors.length > 0) {
        const errorMessages = errors.map(error => 
          Object.values(error.constraints || {})
        ).flat();
        res.status(400).json({ 
          success: false,
          errors: errorMessages 
        });
        return;
      }

      const { student_id, start_date, end_date } = getPaymentsDto;
      const result = await this.paymentService.getPaymentsByStudentInRange(student_id, start_date, end_date);

      res.status(200).json({
        success: true,
        data: result,
        message: 'Payments retrieved successfully'
      });
    } catch (error) {
      const status = error.message.includes('not found') ? 404 : 500;
      res.status(status).json({
        success: false,
        message: error.message || 'Failed to retrieve payments'
      });
    }
  };
}
