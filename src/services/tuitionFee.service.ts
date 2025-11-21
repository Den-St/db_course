import { getRepository } from 'typeorm';
import { TuitionFee } from '../orm/entities/TuitionFee.entity';
import { Student } from '../orm/entities/Student.entity';
import { CreateTuitionFeeDto } from '../dto/CreateTuitionFee.dto';

export class TuitionFeeService {
  private tuitionFeeRepository = getRepository(TuitionFee);
  private studentRepository = getRepository(Student);

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
}
