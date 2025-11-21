import { getRepository, Repository } from 'typeorm';
import { Assignment } from '../orm/entities/Assignment.entity';
import { Course } from '../orm/entities/Course.entity';
import { Teacher } from '../orm/entities/Teacher.entity';
import { Student } from '../orm/entities/Student.entity';
import { Enrollment } from '../orm/entities/Enrollment.entity';
import { CreateAssignmentDto } from '../dto/CreateAssignment.dto';
import { GetAssignmentsForStudentGroupDto } from '../dto/GetAssignmentsForStudentGroup.dto';

export class AssignmentService {
  private assignmentRepository: Repository<Assignment>;
  private courseRepository: Repository<Course>;
  private teacherRepository: Repository<Teacher>;
  private studentRepository: Repository<Student>;
  private enrollmentRepository: Repository<Enrollment>;

  constructor() {
    this.assignmentRepository = getRepository(Assignment);
    this.courseRepository = getRepository(Course);
    this.teacherRepository = getRepository(Teacher);
    this.studentRepository = getRepository(Student);
    this.enrollmentRepository = getRepository(Enrollment);
  }

  async createAssignment(createAssignmentDto: CreateAssignmentDto): Promise<Assignment> {
    const { course_id, teacher_id, title, description, assign_date, due_date, max_grade } = createAssignmentDto;

    // Verify course exists if provided
    let course = null;
    if (course_id) {
      course = await this.courseRepository.findOne({ where: { id: course_id } });
      if (!course) {
        throw new Error('Course not found');
      }
    }

    // Verify teacher exists if provided
    let teacher = null;
    if (teacher_id) {
      teacher = await this.teacherRepository.findOne({ where: { id: teacher_id } });
      if (!teacher) {
        throw new Error('Teacher not found');
      }
    }

    const assignment = this.assignmentRepository.create({
      course,
      teacher,
      title,
      description: description ?? null,
      assign_date: assign_date ? new Date(assign_date) : undefined,
      due_date: new Date(due_date),
      max_grade: max_grade ?? 100,
    });

    return await this.assignmentRepository.save(assignment);
  }

  async findById(id: number): Promise<Assignment | undefined> {
    return await this.assignmentRepository.findOne({
      where: { id },
      relations: ['course', 'teacher']
    });
  }

  async getAssignmentsForStudentGroup(dto: GetAssignmentsForStudentGroupDto): Promise<Assignment[]> {
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

    const query = this.assignmentRepository
      .createQueryBuilder('assignment')
      .leftJoinAndSelect('assignment.course', 'course')
      .leftJoinAndSelect('assignment.teacher', 'teacher')
      .where('assignment.course_id IN (:...courseIds)', { courseIds });

    if (start_date) {
      query.andWhere('assignment.assign_date >= :startDate', { startDate: start_date });
    }

    if (end_date) {
      query.andWhere('assignment.assign_date <= :endDate', { endDate: end_date });
    }

    return await query.orderBy('assignment.assign_date', 'DESC').getMany();
  }
}
