import { getRepository, Repository, SelectQueryBuilder } from 'typeorm';
import { Submission } from '../orm/entities/Submission.entity';
import { Assignment } from '../orm/entities/Assignment.entity';
import { Student } from '../orm/entities/Student.entity';
import { CreateSubmissionDto } from '../dto/CreateSubmission.dto';
import { FilterSubmissionDto } from '../dto/FilterSubmission.dto';

export class SubmissionService {
  private submissionRepository: Repository<Submission>;
  private assignmentRepository: Repository<Assignment>;
  private studentRepository: Repository<Student>;

  constructor() {
    this.submissionRepository = getRepository(Submission);
    this.assignmentRepository = getRepository(Assignment);
    this.studentRepository = getRepository(Student);
  }

  async createSubmission(createSubmissionDto: CreateSubmissionDto): Promise<Submission> {
    const { assignment_id, student_id, content, is_late, feedback_given } = createSubmissionDto;

    // Verify assignment exists
    const assignment = await this.assignmentRepository.findOne({ where: { id: assignment_id } });
    if (!assignment) {
      throw new Error('Assignment not found');
    }

    // Verify student exists
    const student = await this.studentRepository.findOne({ where: { id: student_id } });
    if (!student) {
      throw new Error('Student not found');
    }

    // Check if submission already exists for this assignment and student
    const existingSubmission = await this.submissionRepository.findOne({
      where: { assignment_id, student_id }
    });
    if (existingSubmission) {
      throw new Error('Submission already exists for this assignment and student');
    }

    // Calculate if submission is late
    const isLate = is_late ?? (new Date() > assignment.due_date);

    const submission = this.submissionRepository.create({
      assignment,
      student,
      content: content ?? null,
      is_late: isLate,
      feedback_given: feedback_given ?? false,
    });

    return await this.submissionRepository.save(submission);
  }

  async findById(id: number): Promise<Submission | undefined> {
    return await this.submissionRepository.findOne({
      where: { id },
      relations: ['assignment', 'student', 'grade']
    });
  }

  async findByAssignment(assignment_id: number): Promise<Submission[]> {
    return await this.submissionRepository.find({
      where: { assignment_id },
      relations: ['student', 'grade']
    });
  }

  async findByStudent(student_id: number): Promise<Submission[]> {
    return await this.submissionRepository.find({
      where: { student_id },
      relations: ['assignment', 'grade']
    });
  }

  async filterSubmissions(filterDto: FilterSubmissionDto): Promise<Submission[]> {
    console.log('Filter DTO:', filterDto);
    const queryBuilder: SelectQueryBuilder<Submission> = this.submissionRepository
      .createQueryBuilder('submission')
      .leftJoinAndSelect('submission.assignment', 'assignment')
      .leftJoinAndSelect('submission.student', 'student')
      .leftJoinAndSelect('submission.grade', 'grade')
      .leftJoinAndSelect('student.group', 'group')
      .leftJoinAndSelect('assignment.teacher', 'teacher');

    if (filterDto.assignment_id) {
      queryBuilder.andWhere('submission.assignment_id = :assignment_id', { 
        assignment_id: filterDto.assignment_id 
      });
    }

    if (filterDto.student_id) {
      queryBuilder.andWhere('submission.student_id = :student_id', { 
        student_id: filterDto.student_id 
      });
    }

    if (filterDto.group_id) {
      queryBuilder.andWhere('student.group_id = :group_id', { 
        group_id: filterDto.group_id 
      });
    }

    if (filterDto.teacher_id) {
      console.log('Filtering by teacher_id:', filterDto.teacher_id);  
      queryBuilder.andWhere('assignment.teacher_id = :teacher_id', { 
        teacher_id: filterDto.teacher_id 
      });
    }

    if (filterDto.title) {
      queryBuilder.andWhere('assignment.title LIKE :title', { 
        title: `%${filterDto.title}%` 
      });
    }

    if (filterDto.description) {
      queryBuilder.andWhere('assignment.description LIKE :description', { 
        description: `%${filterDto.description}%` 
      });
    }

    if (filterDto.is_late !== undefined) {
      queryBuilder.andWhere('submission.is_late = :is_late', { 
        is_late: filterDto.is_late 
      });
    }

    if (filterDto.feedback_given !== undefined) {
      queryBuilder.andWhere('submission.feedback_given = :feedback_given', { 
        feedback_given: filterDto.feedback_given 
      });
    }

    if (filterDto.submitted_from) {
      queryBuilder.andWhere('submission.submitted_at >= :submitted_from', { 
        submitted_from: filterDto.submitted_from 
      });
    }

    if (filterDto.submitted_to) {
      queryBuilder.andWhere('submission.submitted_at <= :submitted_to', { 
        submitted_to: filterDto.submitted_to 
      });
    }

    return await queryBuilder.getMany();
  }
}
