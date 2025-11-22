import { getRepository } from 'typeorm';
import { Payment } from '../orm/entities/Payment.entity';
import { TuitionFee } from '../orm/entities/TuitionFee.entity';
import { Student } from '../orm/entities/Student.entity';
import { CreatePaymentDto } from '../dto/CreatePayment.dto';

export class PaymentService {
  private paymentRepository = getRepository(Payment);
  private tuitionFeeRepository = getRepository(TuitionFee);
  private studentRepository = getRepository(Student);

  async createPayment(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    const { tuition_fee_id, amount_paid, payment_date, payment_method, receipt_reference } = createPaymentDto;

    // Verify tuition fee exists
    const tuitionFee = await this.tuitionFeeRepository.findOne({
      where: { id: tuition_fee_id }
    });

    if (!tuitionFee) {
      throw new Error('Tuition fee not found');
    }

    const payment = this.paymentRepository.create({
      tuition_fee_id,
      amount_paid,
      payment_date: payment_date ? new Date(payment_date) : new Date(),
      payment_method,
      receipt_reference
    });

    const savedPayment = await this.paymentRepository.save(payment);

    // Update tuition fee with payment reference
    tuitionFee.payment_id = savedPayment.id;
    await this.tuitionFeeRepository.save(tuitionFee);

    return savedPayment;
  }

  async getPaymentsByStudentInRange(student_id: number, start_date?: string, end_date?: string): Promise<{ payments: Payment[], count: number, totalAmountPaid: number }> {
    // Verify student exists
    const student = await this.studentRepository.findOne({
      where: { id: student_id }
    });

    if (!student) {
      throw new Error('Student not found');
    }

    // Build query
    const query = this.paymentRepository
      .createQueryBuilder('payment')
      .innerJoin('payment.tuition_fee', 'tuitionFee')
      .leftJoinAndSelect('payment.tuition_fee', 'tuition_fee')
      .leftJoinAndSelect('tuition_fee.student', 'student')
      .where('tuitionFee.student_id = :student_id', { student_id });

    // Add date filters if provided
    if (start_date) {
      query.andWhere('payment.payment_date >= :start_date', { start_date });
    }

    if (end_date) {
      query.andWhere('payment.payment_date <= :end_date', { end_date });
    }

    const payments = await query
      .orderBy('payment.payment_date', 'DESC')
      .getMany();

    // Calculate total amount paid
    const totalAmountPaid = payments.reduce((sum, payment) => sum + (Number(payment.amount_paid) || 0), 0);

    return {
      payments,
      count: payments.length,
      totalAmountPaid
    };
  }
}
