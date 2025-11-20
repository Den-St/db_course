import { getRepository, Repository } from 'typeorm';
import { Assignment } from '../orm/entities/Assignment.entity';
import { Course } from '../orm/entities/Course.entity';
import { Teacher } from '../orm/entities/Teacher.entity';
import { CreateAssignmentDto } from '../dto/CreateAssignment.dto';

export class AssignmentService {
  private assignmentRepository: Repository<Assignment>;
  private courseRepository: Repository<Course>;
  private teacherRepository: Repository<Teacher>;

  constructor() {
    this.assignmentRepository = getRepository(Assignment);
    this.courseRepository = getRepository(Course);
    this.teacherRepository = getRepository(Teacher);
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
}
