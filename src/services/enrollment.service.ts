import { getRepository } from 'typeorm';
import { Enrollment } from '../orm/entities/Enrollment.entity';
import { Student } from '../orm/entities/Student.entity';
import { Course } from '../orm/entities/Course.entity';

export class EnrollmentService {
  private enrollmentRepository = getRepository(Enrollment);
  private studentRepository = getRepository(Student);
  private courseRepository = getRepository(Course);

  async create(data: {
    student_id: number;
    course_id: number;
  }): Promise<Enrollment> {
    const student = await this.studentRepository.findOne({
      where: { id: data.student_id },
    });
    
    if (!student) {
      throw new Error('Student not found');
    }

    const course = await this.courseRepository.findOne({
      where: { id: data.course_id },
    });
    
    if (!course) {
      throw new Error('Course not found');
    }

    const enrollment = new Enrollment();
    enrollment.student_id = data.student_id;
    enrollment.course_id = data.course_id;

    return await this.enrollmentRepository.save(enrollment);
  }
}
