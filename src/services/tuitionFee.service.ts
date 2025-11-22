import { getRepository } from 'typeorm';
import { TuitionFee } from '../orm/entities/TuitionFee.entity';
import { Student } from '../orm/entities/Student.entity';
import { Group } from '../orm/entities/Group.entity';
import { Enrollment } from '../orm/entities/Enrollment.entity';
import { CreateTuitionFeeDto } from '../dto/CreateTuitionFee.dto';
import { CreateTuitionFeeByGroupDto } from '../dto/CreateTuitionFeeByGroup.dto';

export class TuitionFeeService {
  private tuitionFeeRepository = getRepository(TuitionFee);
  private studentRepository = getRepository(Student);
  private groupRepository = getRepository(Group);
  private enrollmentRepository = getRepository(Enrollment);

  async createTuitionFee(createTuitionFeeDto: CreateTuitionFeeDto): Promise<TuitionFee> {
    const { student_id, period_start, period_end, amount, due_date, description } = createTuitionFeeDto;

    // Verify student exists if provided
    if (student_id !== undefined) {
      const student = await this.studentRepository.findOne({
        where: { id: student_id }
      });

      if (!student) {
        throw new Error('Student not found');
      }
    }

    const tuitionFee = this.tuitionFeeRepository.create({
      student_id,
      period_start: new Date(period_start),
      period_end: new Date(period_end),
      amount,
      due_date: new Date(due_date),
      description
    });

    return await this.tuitionFeeRepository.save(tuitionFee);
  }

  async getTuitionFeesByStudentInRange(student_id: number, start_date?: string, end_date?: string): Promise<{ tuitionFees: TuitionFee[], count: number, totalAmount: number }> {
    // Verify student exists
    const student = await this.studentRepository.findOne({
      where: { id: student_id }
    });

    if (!student) {
      throw new Error('Student not found');
    }

    // Build query
    const query = this.tuitionFeeRepository
      .createQueryBuilder('tuitionFee')
      .leftJoinAndSelect('tuitionFee.student', 'student')
      .leftJoinAndSelect('tuitionFee.payment', 'payment')
      .where('tuitionFee.student_id = :student_id', { student_id });

    // Add date filters if provided
    if (start_date) {
      query.andWhere('tuitionFee.period_start >= :start_date', { start_date });
    }

    if (end_date) {
      query.andWhere('tuitionFee.period_end <= :end_date', { end_date });
    }

    const tuitionFees = await query
      .orderBy('tuitionFee.period_start', 'DESC')
      .getMany();

    // Calculate total amount
    const totalAmount = tuitionFees.reduce((sum, fee) => sum + (Number(fee.amount) || 0), 0);

    return {
      tuitionFees,
      count: tuitionFees.length,
      totalAmount
    };
  }

  async createTuitionFeeByGroup(createTuitionFeeByGroupDto: CreateTuitionFeeByGroupDto): Promise<{ tuitionFees: TuitionFee[], count: number }> {
    const { group_id, period_start, period_end, amount, due_date, description } = createTuitionFeeByGroupDto;

    // Verify group exists
    const group = await this.groupRepository.findOne({
      where: { id: group_id }
    });

    if (!group) {
      throw new Error('Group not found');
    }

    // Get all students in this group
    const students = await this.studentRepository.find({
      where: { group_id }
    });

    if (students.length === 0) {
      throw new Error('No students found in this group');
    }

    // Create tuition fees for each student
    const tuitionFees: TuitionFee[] = [];

    for (const student of students) {
      const tuitionFee = this.tuitionFeeRepository.create({
        student_id: student.id,
        period_start: new Date(period_start),
        period_end: new Date(period_end),
        amount,
        due_date: new Date(due_date),
        description
      });

      const savedTuitionFee = await this.tuitionFeeRepository.save(tuitionFee);
      tuitionFees.push(savedTuitionFee);
    }

    return {
      tuitionFees,
      count: tuitionFees.length
    };
  }

  async getTuitionFeesByGroup(group_id: number, start_date?: string, end_date?: string): Promise<{ tuitionFees: TuitionFee[], count: number, totalAmount: number }> {
    // Verify group exists
    const group = await this.groupRepository.findOne({
      where: { id: group_id }
    });

    if (!group) {
      throw new Error('Group not found');
    }

    // Build query
    const query = this.tuitionFeeRepository
      .createQueryBuilder('tuitionFee')
      .innerJoin('tuitionFee.student', 'student')
      .leftJoinAndSelect('tuitionFee.student', 'student_relation')
      .leftJoinAndSelect('tuitionFee.payment', 'payment')
      .where('student.group_id = :group_id', { group_id });

    // Add date filters if provided
    if (start_date) {
      query.andWhere('tuitionFee.period_start >= :start_date', { start_date });
    }

    if (end_date) {
      query.andWhere('tuitionFee.period_end <= :end_date', { end_date });
    }

    const tuitionFees = await query
      .orderBy('tuitionFee.period_start', 'DESC')
      .addOrderBy('student.id', 'ASC')
      .getMany();

    // Calculate total amount
    const totalAmount = tuitionFees.reduce((sum, fee) => sum + (Number(fee.amount) || 0), 0);

    return {
      tuitionFees,
      count: tuitionFees.length,
      totalAmount
    };
  }

  async getOverdueTuitionFees(group_id?: number, student_id?: number, start_date?: string, end_date?: string): Promise<{ tuitionFees: TuitionFee[], count: number, totalAmount: number }> {
    // Verify group exists if provided
    if (group_id !== undefined) {
      const group = await this.groupRepository.findOne({
        where: { id: group_id }
      });

      if (!group) {
        throw new Error('Group not found');
      }
    }

    // Verify student exists if provided
    if (student_id !== undefined) {
      const student = await this.studentRepository.findOne({
        where: { id: student_id }
      });

      if (!student) {
        throw new Error('Student not found');
      }
    }

    // Build query
    const query = this.tuitionFeeRepository
      .createQueryBuilder('tuitionFee')
      .leftJoinAndSelect('tuitionFee.student', 'student')
      .leftJoin('tuitionFee.payment', 'payment')
      .where('tuitionFee.payment_id IS NULL')
      .andWhere('tuitionFee.due_date < CURRENT_DATE');

    // Add student filter if provided
    if (student_id !== undefined) {
      query.andWhere('tuitionFee.student_id = :student_id', { student_id });
    }
    // Add group filter if provided (and student_id not provided)
    else if (group_id !== undefined) {
      query.andWhere('student.group_id = :group_id', { group_id });
    }

    // Add date filters if provided
    if (start_date) {
      query.andWhere('tuitionFee.due_date >= :start_date', { start_date });
    }

    if (end_date) {
      query.andWhere('tuitionFee.due_date <= :end_date', { end_date });
    }

    const tuitionFees = await query
      .orderBy('tuitionFee.due_date', 'ASC')
      .addOrderBy('student.id', 'ASC')
      .getMany();

    // Calculate total amount
    const totalAmount = tuitionFees.reduce((sum, fee) => sum + (Number(fee.amount) || 0), 0);

    return {
      tuitionFees,
      count: tuitionFees.length,
      totalAmount
    };
  }
}
