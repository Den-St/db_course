import { Request, Response } from 'express';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { AssignmentFeedbackService } from '../services/assignmentFeedback.service';
import { CreateAssignmentFeedbackDto } from '../dto/CreateAssignmentFeedback.dto';
import { UpdateAssignmentFeedbackDto } from '../dto/UpdateAssignmentFeedback.dto';
import { GetStudentFeedbacksInRangeDto } from '../dto/GetStudentFeedbacksInRange.dto';

export class AssignmentFeedbackController {
  private feedbackService: AssignmentFeedbackService;

  constructor() {
    this.feedbackService = new AssignmentFeedbackService();
  }

  createFeedback = async (req: Request, res: Response): Promise<void> => {
    try {
      const createFeedbackDto = plainToClass(CreateAssignmentFeedbackDto, req.body);

      const errors = await validate(createFeedbackDto);
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

      const feedback = await this.feedbackService.createFeedback(createFeedbackDto);

      res.status(201).json({
        success: true,
        data: feedback,
        message: 'Feedback created successfully'
      });
    } catch (error) {
      const status = error.message.includes('not found') ? 404 : 500;
      res.status(status).json({
        success: false,
        message: error.message || 'Failed to create feedback'
      });
    }
  };

  updateFeedback = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const updateFeedbackDto = plainToClass(UpdateAssignmentFeedbackDto, req.body);

      const errors = await validate(updateFeedbackDto);
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

      const feedback = await this.feedbackService.updateFeedback(Number(id), updateFeedbackDto);

      res.status(200).json({
        success: true,
        data: feedback,
        message: 'Feedback updated successfully'
      });
    } catch (error) {
      const status = error.message.includes('not found') ? 404 : 500;
      res.status(status).json({
        success: false,
        message: error.message || 'Failed to update feedback'
      });
    }
  };

  getFeedbackBySubmission = async (req: Request, res: Response): Promise<void> => {
    try {
      const { submission_id } = req.params;
      const feedbacks = await this.feedbackService.getFeedbackBySubmission(Number(submission_id));

      res.status(200).json({
        success: true,
        data: feedbacks,
        message: 'Feedbacks retrieved successfully'
      });
    } catch (error) {
      const status = error.message.includes('not found') ? 404 : 500;
      res.status(status).json({
        success: false,
        message: error.message || 'Failed to retrieve feedbacks'
      });
    }
  };

  deleteFeedback = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      await this.feedbackService.deleteFeedback(Number(id));

      res.status(200).json({
        success: true,
        message: 'Feedback deleted successfully'
      });
    } catch (error) {
      const status = error.message.includes('not found') ? 404 : 500;
      res.status(status).json({
        success: false,
        message: error.message || 'Failed to delete feedback'
      });
    }
  };

  getStudentFeedbacksInRange = async (req: Request, res: Response): Promise<void> => {
    try {
      const getStudentFeedbacksDto = plainToClass(GetStudentFeedbacksInRangeDto, req.query);

      const errors = await validate(getStudentFeedbacksDto);
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

      const { student_id, start_date, end_date, course_id } = getStudentFeedbacksDto;
      const result = await this.feedbackService.getStudentFeedbacksInRange(student_id, start_date, end_date, course_id);

      res.status(200).json({
        success: true,
        data: result,
        message: 'Student feedbacks retrieved successfully'
      });
    } catch (error) {
      const status = error.message.includes('not found') ? 404 : 500;
      res.status(status).json({
        success: false,
        message: error.message || 'Failed to retrieve student feedbacks'
      });
    }
  };
}
