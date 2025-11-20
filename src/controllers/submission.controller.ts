import { Request, Response } from 'express';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { SubmissionService } from '../services/submission.service';
import { CreateSubmissionDto } from '../dto/CreateSubmission.dto';
import { FilterSubmissionDto } from '../dto/FilterSubmission.dto';

export class SubmissionController {
  private submissionService: SubmissionService;

  constructor() {
    this.submissionService = new SubmissionService();
  }

  createSubmission = async (req: Request, res: Response): Promise<void> => {
    try {
      const createSubmissionDto = plainToClass(CreateSubmissionDto, req.body);
      console.log('createSubmissionDto', createSubmissionDto);

      const errors = await validate(createSubmissionDto);
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

      const submission = await this.submissionService.createSubmission(createSubmissionDto);

      res.status(201).json({
        success: true,
        data: submission,
        message: 'Submission created successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to create submission'
      });
    }
  };

  filterSubmissions = async (req: Request, res: Response): Promise<void> => {
    try {
      const filterSubmissionDto = plainToClass(FilterSubmissionDto, req.body);
      console.log('filterSubmissionDto', filterSubmissionDto);

      const errors = await validate(filterSubmissionDto);
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

      const submissions = await this.submissionService.filterSubmissions(filterSubmissionDto);

      res.status(200).json({
        success: true,
        data: submissions,
        count: submissions.length,
        message: 'Submissions retrieved successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to filter submissions'
      });
    }
  };
}
