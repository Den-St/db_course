import { Request, Response } from 'express';
import { CourseService } from '../services/course.service';

export class CourseController {
  private courseService = new CourseService();

  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, description, mandatory, grade_level, teacher_id } = req.body;

      if (!name) {
        res.status(400).json({ error: 'Name is required' });
        return;
      }

      const course = await this.courseService.create({
        name,
        description,
        mandatory,
        grade_level,
        teacher_id,
      });

      res.status(201).json(course);
    } catch (error) {
      if (error.message === 'Teacher not found') {
        res.status(404).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: 'Failed to create course' });
    }
  };

  assignTeacher = async (req: Request, res: Response): Promise<void> => {
    try {
      console.log('Request body:', req.body);
      const { course_id, teacher_id } = req.body;
      
      if (!course_id || !teacher_id) {
        res.status(400).json({ error: 'course_id and teacher_id are required' });
        return;
      }

      const course = await this.courseService.assignTeacher(
        Number(course_id),
        Number(teacher_id)
      );
      
      res.status(200).json(course);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  getCoursesByTeacher = async (req: Request, res: Response): Promise<void> => {
    try {
      const { teacher_id } = req.params;
      
      if (!teacher_id) {
        res.status(400).json({ error: 'teacher_id is required' });
        return;
      }

      const courses = await this.courseService.getCoursesByTeacher(Number(teacher_id));
      
      res.status(200).json(courses);
    } catch (error) {
      if (error.message === 'Teacher not found') {
        res.status(404).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: 'Failed to fetch courses' });
    }
  };
}
