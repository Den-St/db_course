import { getRepository, Repository } from 'typeorm';
import { Lesson } from '../orm/entities/Lesson.entity';
import { Course } from '../orm/entities/Course.entity';
import { Teacher } from '../orm/entities/Teacher.entity';
import { CreateLessonDto } from '../dto/CreateLesson.dto';
import { GetLessonsForStudentDto } from '../dto/GetLessonsForStudent.dto';
import { Student } from '../orm/entities/Student.entity';
import { Enrollment } from '../orm/entities/Enrollment.entity';

export class LessonService {
  private lessonRepository: Repository<Lesson>;
  private courseRepository: Repository<Course>;
  private teacherRepository: Repository<Teacher>;
  private studentRepository: Repository<Student>;
  private enrollmentRepository: Repository<Enrollment>;

  constructor() {
    this.lessonRepository = getRepository(Lesson);
    this.courseRepository = getRepository(Course);
    this.teacherRepository = getRepository(Teacher);
    this.studentRepository = getRepository(Student);
    this.enrollmentRepository = getRepository(Enrollment);
  }

  async createLesson(createLessonDto: CreateLessonDto): Promise<Lesson> {
    const { course_id, teacher_id, lesson_date, start_time, end_time, topic } = createLessonDto;

    // Verify course exists
    const course = await this.courseRepository.findOne({ where: { id: course_id } });
    if (!course) {
      throw new Error('Course not found');
    }

    // Verify teacher exists
    const teacher = await this.teacherRepository.findOne({ where: { id: teacher_id } });
    if (!teacher) {
      throw new Error('Teacher not found');
    }

    const lesson = this.lessonRepository.create({
      course,
      teacher,
      lesson_date: new Date(lesson_date),
      start_time,
      end_time,
      topic,
    });

    return await this.lessonRepository.save(lesson);
  }

  async getLessonsForStudent(dto: GetLessonsForStudentDto): Promise<Lesson[]> {
    const { student_id, start_date, end_date } = dto;

    // Verify student exists
    const student = await this.studentRepository.findOne({ 
      where: { id: student_id }
    });

    if (!student) {
      throw new Error('Student not found');
    }

    // Get all course IDs the student is enrolled in
    const enrollments = await this.enrollmentRepository.find({
      where: { student_id },
      select: ['course_id']
    });

    if (enrollments.length === 0) {
      return [];
    }

    const courseIds = enrollments.map(e => e.course_id);

    const query = this.lessonRepository
      .createQueryBuilder('lesson')
      .leftJoinAndSelect('lesson.course', 'course')
      .leftJoinAndSelect('lesson.teacher', 'teacher')
      .where('lesson.course_id IN (:...courseIds)', { courseIds });

    if (start_date) {
      query.andWhere('lesson.lesson_date >= :startDate', { startDate: start_date });
    }

    if (end_date) {
      query.andWhere('lesson.lesson_date <= :endDate', { endDate: end_date });
    }

    return await query.orderBy('lesson.lesson_date', 'ASC').getMany();
  }
}
