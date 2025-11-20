import { Request, Response } from 'express';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { GradeService } from '../services/grade.service';
import { CreateGradeDto } from '../dto/CreateGrade.dto';
import { UpdateGradeDto } from '../dto/UpdateGrade.dto';
import { GetGroupAverageGradeDto } from '../dto/GetGroupAverageGrade.dto';

export class GradeController {
  private gradeService: GradeService;

  constructor() {
    this.gradeService = new GradeService();
  }

  createGrade = async (req: Request, res: Response): Promise<void> => {
    try {
      const createGradeDto = plainToClass(CreateGradeDto, req.body);
      console.log('createGradeDto', createGradeDto);

      const errors = await validate(createGradeDto);
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

      const grade = await this.gradeService.createGrade(createGradeDto);

      res.status(201).json({
        success: true,
        data: grade,
        message: 'Grade created successfully'
      });
    } catch (error) {
      const status = error.message.includes('not found') || error.message.includes('already has') ? 400 : 500;
      res.status(status).json({
        success: false,
        message: error.message || 'Failed to create grade'
      });
    }
  };

  updateGrade = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const updateGradeDto = plainToClass(UpdateGradeDto, req.body);

      const errors = await validate(updateGradeDto);
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

      const grade = await this.gradeService.updateGrade(Number(id), updateGradeDto);

      res.status(200).json({
        success: true,
        data: grade,
        message: 'Grade updated successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to update grade'
      });
    }
  };

  getGroupAverageGrade = async (req: Request, res: Response): Promise<void> => {
    try {
      const getGroupAverageGradeDto = plainToClass(GetGroupAverageGradeDto, req.query);

      const errors = await validate(getGroupAverageGradeDto);
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

      const { group_id, start_date, end_date } = getGroupAverageGradeDto;
      const result = await this.gradeService.getGroupAverageGrade(group_id, start_date, end_date);

      res.status(200).json({
        success: true,
        data: result,
        message: 'Group average grade retrieved successfully'
      });
    } catch (error) {
      const status = error.message.includes('not found') ? 404 : 500;
      res.status(status).json({
        success: false,
        message: error.message || 'Failed to retrieve group average grade'
      });
    }
  };
}
