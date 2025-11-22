import { Request, Response } from 'express';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { TuitionFeeService } from '../services/tuitionFee.service';
import { CreateTuitionFeeDto } from '../dto/CreateTuitionFee.dto';
import { GetTuitionFeesByStudentInRangeDto } from '../dto/GetTuitionFeesByStudentInRange.dto';
import { CreateTuitionFeeByGroupDto } from '../dto/CreateTuitionFeeByGroup.dto';
import { GetTuitionFeesByGroupDto } from '../dto/GetTuitionFeesByGroup.dto';
import { GetOverdueTuitionFeesDto } from '../dto/GetOverdueTuitionFees.dto';

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

  getTuitionFeesByStudentInRange = async (req: Request, res: Response): Promise<void> => {
    try {
      const getTuitionFeesDto = plainToClass(GetTuitionFeesByStudentInRangeDto, req.query);

      const errors = await validate(getTuitionFeesDto);
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

      const { student_id, start_date, end_date } = getTuitionFeesDto;
      const result = await this.tuitionFeeService.getTuitionFeesByStudentInRange(student_id, start_date, end_date);

      res.status(200).json({
        success: true,
        data: result,
        message: 'Tuition fees retrieved successfully'
      });
    } catch (error) {
      const status = error.message.includes('not found') ? 404 : 500;
      res.status(status).json({
        success: false,
        message: error.message || 'Failed to retrieve tuition fees'
      });
    }
  };

  createTuitionFeeByGroup = async (req: Request, res: Response): Promise<void> => {
    try {
      const createTuitionFeeByGroupDto = plainToClass(CreateTuitionFeeByGroupDto, req.body);

      const errors = await validate(createTuitionFeeByGroupDto);
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

      const result = await this.tuitionFeeService.createTuitionFeeByGroup(createTuitionFeeByGroupDto);

      res.status(201).json({
        success: true,
        data: result,
        message: 'Tuition fees created successfully for all students in the group'
      });
    } catch (error) {
      const status = error.message.includes('not found') ? 404 : 500;
      res.status(status).json({
        success: false,
        message: error.message || 'Failed to create tuition fees'
      });
    }
  };

  getTuitionFeesByGroup = async (req: Request, res: Response): Promise<void> => {
    try {
      const getTuitionFeesDto = plainToClass(GetTuitionFeesByGroupDto, req.query);

      const errors = await validate(getTuitionFeesDto);
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

      const { group_id, start_date, end_date } = getTuitionFeesDto;
      const result = await this.tuitionFeeService.getTuitionFeesByGroup(group_id, start_date, end_date);

      res.status(200).json({
        success: true,
        data: result,
        message: 'Tuition fees retrieved successfully'
      });
    } catch (error) {
      const status = error.message.includes('not found') ? 404 : 500;
      res.status(status).json({
        success: false,
        message: error.message || 'Failed to retrieve tuition fees'
      });
    }
  };

  getOverdueTuitionFees = async (req: Request, res: Response): Promise<void> => {
    try {
      const getOverdueTuitionFeesDto = plainToClass(GetOverdueTuitionFeesDto, req.query);

      const errors = await validate(getOverdueTuitionFeesDto);
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

      const { group_id, student_id, start_date, end_date } = getOverdueTuitionFeesDto;
      const result = await this.tuitionFeeService.getOverdueTuitionFees(group_id, student_id, start_date, end_date);

      res.status(200).json({
        success: true,
        data: result,
        message: 'Overdue tuition fees retrieved successfully'
      });
    } catch (error) {
      const status = error.message.includes('not found') ? 404 : 500;
      res.status(status).json({
        success: false,
        message: error.message || 'Failed to retrieve overdue tuition fees'
      });
    }
  };
}
