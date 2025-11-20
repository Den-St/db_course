import { Request, Response } from 'express';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { LessonService } from '../services/lesson.service';
import { CreateLessonDto } from '../dto/CreateLesson.dto';

export class LessonController {
  private lessonService: LessonService;

  constructor() {
    this.lessonService = new LessonService();
  }

  createLesson = async (req: Request, res: Response): Promise<void> => {
    try {
      const createLessonDto = plainToClass(CreateLessonDto, req.body);

      const errors = await validate(createLessonDto);
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

      const lesson = await this.lessonService.createLesson(createLessonDto);

      res.status(201).json({
        success: true,
        data: lesson,
        message: 'Lesson created successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to create lesson'
      });
    }
  };
}
