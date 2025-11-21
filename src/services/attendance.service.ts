import { getRepository, Repository } from 'typeorm';
import { Attendance } from '../orm/entities/Attendance.entity';
import { Student } from '../orm/entities/Student.entity';
import { Lesson } from '../orm/entities/Lesson.entity';
import { Course } from '../orm/entities/Course.entity';
import { CreateAttendanceDto } from '../dto/CreateAttendance.dto';
import { UpdateAttendanceDto } from '../dto/UpdateAttendance.dto';
import { FindAttendanceDto } from '../dto/FindAttendance.dto';

export class AttendanceService {
  private attendanceRepository: Repository<Attendance>;
  private studentRepository: Repository<Student>;
  private lessonRepository: Repository<Lesson>;
  private courseRepository: Repository<Course>;

  constructor() {
    this.attendanceRepository = getRepository(Attendance);
    this.studentRepository = getRepository(Student);
    this.lessonRepository = getRepository(Lesson);
    this.courseRepository = getRepository(Course);
  }

  async createAttendance(createAttendanceDto: CreateAttendanceDto): Promise<Attendance> {
    const { student_id, lesson_id, attended } = createAttendanceDto;

    // Verify student exists
    const student = await this.studentRepository.findOne({ where: { id: student_id } });
    if (!student) {
      throw new Error('Student not found');
    }

    // Verify lesson exists
    const lesson = await this.lessonRepository.findOne({ where: { id: lesson_id } });
    if (!lesson) {
      throw new Error('Lesson not found');
    }

    // Check if attendance already exists for this student and lesson
    const existingAttendance = await this.attendanceRepository.findOne({
      where: {
        student: { id: student_id },
        lesson: { id: lesson_id },
      },
    });
    if (existingAttendance) {
      throw new Error('Attendance record already exists for this student and lesson');
    }

    const attendance = this.attendanceRepository.create({
      student,
      lesson,
      attended: attended ?? false,
    });

    return await this.attendanceRepository.save(attendance);
  }

  async updateAttendance(id: number, updateAttendanceDto: UpdateAttendanceDto): Promise<Attendance> {
    const { attended } = updateAttendanceDto;

    const attendance = await this.attendanceRepository.findOne({ where: { id } });
    if (!attendance) {
      throw new Error('Attendance record not found');
    }

    attendance.attended = attended;

    return await this.attendanceRepository.save(attendance);
  }

  async findAttendance(findAttendanceDto: FindAttendanceDto): Promise<Attendance[]> {
    const { group_id, student_id, start_date, end_date } = findAttendanceDto;

    const queryBuilder = this.attendanceRepository
      .createQueryBuilder('attendance')
      .leftJoinAndSelect('attendance.student', 'student')
      .leftJoinAndSelect('attendance.lesson', 'lesson')
      .leftJoinAndSelect('student.group', 'group');

    if (student_id) {
      queryBuilder.andWhere('attendance.student_id = :student_id', { student_id });
    }

    if (group_id) {
      queryBuilder.andWhere('student.group_id = :group_id', { group_id });
    }

    if (start_date) {
      queryBuilder.andWhere('lesson.lesson_date >= :start_date', { start_date });
    }

    if (end_date) {
      queryBuilder.andWhere('lesson.lesson_date <= :end_date', { end_date });
    }

    return await queryBuilder.getMany();
  }

  async getStudentAttendancesInRange(student_id: number, start_date: string, end_date: string, course_id?: number): Promise<{ attendances: Attendance[], count: number, present_count: number, absent_count: number }> {
    // Verify student exists
    const student = await this.studentRepository.findOne({
      where: { id: student_id }
    });

    if (!student) {
      throw new Error('Student not found');
    }

    // Verify course exists if provided
    if (course_id !== undefined) {
      const course = await this.courseRepository.findOne({
        where: { id: course_id }
      });

      if (!course) {
        throw new Error('Course not found');
      }
    }

    // Build query
    const query = this.attendanceRepository
      .createQueryBuilder('attendance')
      .innerJoin('attendance.lesson', 'lesson')
      .leftJoinAndSelect('lesson.course', 'course')
      .leftJoinAndSelect('lesson.teacher', 'teacher')
      .leftJoinAndSelect('teacher.user', 'user')
      .where('attendance.student_id = :student_id', { student_id })
      .andWhere('lesson.date >= :start_date', { start_date })
      .andWhere('lesson.date <= :end_date', { end_date });

    // Add course filter if provided
    if (course_id !== undefined) {
      query.andWhere('lesson.course_id = :course_id', { course_id });
    }

    const attendances = await query
      .orderBy('lesson.date', 'DESC')
      .getMany();

    const present_count = attendances.filter(a => a.attended === true).length;
    const absent_count = attendances.filter(a => a.attended === false).length;

    return {
      attendances,
      count: attendances.length,
      present_count,
      absent_count
    };
  }
}
