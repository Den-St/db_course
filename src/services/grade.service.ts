import { Grade } from '../orm/entities/Grade.entity';
import { Student } from '../orm/entities/Student.entity';
import { Course } from '../orm/entities/Course.entity';
import { Teacher } from '../orm/entities/Teacher.entity';
import { Submission } from '../orm/entities/Submission.entity';
import { CreateGradeDto } from '../dto/CreateGrade.dto';
import { UpdateGradeDto } from '../dto/UpdateGrade.dto';
import { getRepository } from 'typeorm';

export class GradeService {
  private gradeRepository = getRepository(Grade);
  private studentRepository = getRepository(Student);
  private courseRepository = getRepository(Course);
  private teacherRepository = getRepository(Teacher);
  private submissionRepository = getRepository(Submission);

  async createGrade(createGradeDto: CreateGradeDto): Promise<Grade> {
    const { student_id, course_id, teacher_id, grade, source, submission_id } = createGradeDto;

    // Verify student exists
    const student = await this.studentRepository.findOne({ where: { id: student_id } });
    if (!student) {
      throw new Error('Student not found');
    }

    // Verify course exists
    const course = await this.courseRepository.findOne({ where: { id: course_id } });
    if (!course) {
      throw new Error('Course not found');
    }

    // Verify teacher exists if provided
    let teacher = null;
    if (teacher_id) {
      teacher = await this.teacherRepository.findOne({ where: { id: teacher_id } });
      if (!teacher) {
        throw new Error('Teacher not found');
      }
    }

    // Verify submission exists and doesn't already have a grade
    const submission = await this.submissionRepository.findOne({
      where: { id: submission_id },
      relations: ['grade']
    });

    if (!submission) {
      throw new Error('Submission not found');
    }

    if (submission.grade) {
      throw new Error('This submission already has a grade');
    }

    const gradeEntity = this.gradeRepository.create({
      student,
      course,
      teacher,
      grade: grade ?? null,
      source: source ?? null,
      submission_id: submission_id
    });

    const savedGrade = await this.gradeRepository.save(gradeEntity);

    // Update submission to link the grade
    submission.grade_id = savedGrade.id;
    await this.submissionRepository.save(submission);

    return savedGrade;
  }

  async updateGrade(id: number, updateGradeDto: UpdateGradeDto): Promise<Grade> {
    const { teacher_id, grade, source } = updateGradeDto;

    const gradeEntity = await this.gradeRepository.findOne({ where: { id } });
    if (!gradeEntity) {
      throw new Error('Grade record not found');
    }

    // Update teacher if provided
    if (teacher_id !== undefined) {
      if (teacher_id === null) {
        gradeEntity.teacher = null;
        gradeEntity.teacher_id = null;
      } else {
        const teacher = await this.teacherRepository.findOne({ where: { id: teacher_id } });
        if (!teacher) {
          throw new Error('Teacher not found');
        }
        gradeEntity.teacher = teacher;
      }
    }

    if (grade !== undefined) {
      gradeEntity.grade = grade;
    }

    if (source !== undefined) {
      gradeEntity.source = source;
    }

    return await this.gradeRepository.save(gradeEntity);
  }

  async getGroupAverageGrade(group_id: number, start_date: string, end_date: string): Promise<{ average: number | null, count: number }> {
    // Verify group exists
    const groupRepository = getRepository('Group');
    const group = await groupRepository.findOne({ where: { id: group_id } });
    if (!group) {
      throw new Error('Group not found');
    }

    const result = await this.gradeRepository
      .createQueryBuilder('grade')
      .innerJoin('grade.student', 'student')
      .where('student.group_id = :group_id', { group_id })
      .andWhere('grade.date_given >= :start_date', { start_date })
      .andWhere('grade.date_given <= :end_date', { end_date })
      .andWhere('grade.grade IS NOT NULL')
      .select('AVG(grade.grade)', 'average')
      .addSelect('COUNT(grade.id)', 'count')
      .getRawOne();

    return {
      average: result.average ? parseFloat(result.average) : null,
      count: parseInt(result.count) || 0
    };
  }
}
