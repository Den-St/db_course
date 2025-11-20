import { Request, Response } from 'express';
import { EnrollmentService } from '../services/enrollment.service';

export class EnrollmentController {
  private enrollmentService = new EnrollmentService();

  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const { student_id, course_id } = req.body;

      if (!student_id || !course_id) {
        res.status(400).json({ error: 'student_id and course_id are required' });
        return;
      }

      const enrollment = await this.enrollmentService.create({
        student_id: Number(student_id),
        course_id: Number(course_id),
      });

      res.status(201).json(enrollment);
    } catch (error) {
      if (error.message === 'Student not found' || error.message === 'Course not found') {
        res.status(404).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: 'Failed to create enrollment' });
    }
  };
}
