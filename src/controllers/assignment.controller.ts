import { Request, Response } from 'express';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { AssignmentService } from '../services/assignment.service';
import { CreateAssignmentDto } from '../dto/CreateAssignment.dto';

export class AssignmentController {
  private assignmentService: AssignmentService;

  constructor() {
    this.assignmentService = new AssignmentService();
  }

  createAssignment = async (req: Request, res: Response): Promise<void> => {
    try {
      const createAssignmentDto = plainToClass(CreateAssignmentDto, req.body);
      console.log('createAssignmentDto', createAssignmentDto);

      const errors = await validate(createAssignmentDto);
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

      const assignment = await this.assignmentService.createAssignment(createAssignmentDto);

      res.status(201).json({
        success: true,
        data: assignment,
        message: 'Assignment created successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to create assignment'
      });
    }
  };
}
