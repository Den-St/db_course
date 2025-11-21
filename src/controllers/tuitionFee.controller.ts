import { Request, Response } from 'express';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { TuitionFeeService } from '../services/tuitionFee.service';
import { CreateTuitionFeeDto } from '../dto/CreateTuitionFee.dto';

export class TuitionFeeController {
  private tuitionFeeService: TuitionFeeService;

  constructor() {
    this.tuitionFeeService = new TuitionFeeService();
  }

  createTuitionFee = async (req: Request, res: Response): Promise<void> => {
    try {
      const createTuitionFeeDto = plainToClass(CreateTuitionFeeDto, req.body);

      const errors = await validate(createTuitionFeeDto);
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

      const tuitionFee = await this.tuitionFeeService.createTuitionFee(createTuitionFeeDto);

      res.status(201).json({
        success: true,
        data: tuitionFee,
        message: 'Tuition fee created successfully'
      });
    } catch (error) {
      const status = error.message.includes('not found') ? 404 : 500;
      res.status(status).json({
        success: false,
        message: error.message || 'Failed to create tuition fee'
      });
    }
  };
}
