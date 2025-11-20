import { getRepository } from 'typeorm';
import { Course } from '../orm/entities/Course.entity';
import { Teacher } from '../orm/entities/Teacher.entity';

export class CourseService {
  private courseRepository = getRepository(Course);
  private teacherRepository = getRepository(Teacher);

  async create(data: {
    name: string;
    description?: string;
    mandatory?: boolean;
    grade_level?: number;
    teacher_id?: number;
  }): Promise<Course> {
    const course = new Course();
    course.name = data.name;
    course.description = data.description || null;
    course.mandatory = data.mandatory || false;
    course.grade_level = data.grade_level || null;

    if (data.teacher_id) {
      const teacher = await this.teacherRepository.findOne({
        where: { id: data.teacher_id },
      });
      if (!teacher) {
        throw new Error('Teacher not found');
      }
      course.teacher = teacher;
    }

    return await this.courseRepository.save(course);
  }

  async assignTeacher(courseId: number, teacherId: number): Promise<Course> {
    const course = await this.courseRepository.findOne({ where: { id: courseId } });
    
    if (!course) {
      throw new Error('Course not found');
    }
  
    const teacher = await this.teacherRepository.findOne({ where: { id: teacherId } });
    
    if (!teacher) {
      throw new Error('Teacher not found');
    }
    
    course.teacher_id = teacherId;  
    return await this.courseRepository.save(course);
  }

  async getCoursesByTeacher(teacherId: number): Promise<Course[]> {
    const teacher = await this.teacherRepository.findOne({ where: { id: teacherId } });
    
    if (!teacher) {
      throw new Error('Teacher not found');
    }

    return await this.courseRepository.find({
      where: { teacher_id: teacherId },
      relations: ['teacher'],
    });
  }
}
