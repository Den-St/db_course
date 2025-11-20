import { getRepository, Repository } from 'typeorm';
import { Lesson } from '../orm/entities/Lesson.entity';
import { Course } from '../orm/entities/Course.entity';
import { Teacher } from '../orm/entities/Teacher.entity';
import { CreateLessonDto } from '../dto/CreateLesson.dto';

export class LessonService {
  private lessonRepository: Repository<Lesson>;
  private courseRepository: Repository<Course>;
  private teacherRepository: Repository<Teacher>;

  constructor() {
    this.lessonRepository = getRepository(Lesson);
    this.courseRepository = getRepository(Course);
    this.teacherRepository = getRepository(Teacher);
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
}
