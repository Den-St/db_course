import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Check, OneToOne } from 'typeorm';

import { Group } from './Group.entity';
import { Student } from './Student.entity';
import { Payment } from './Payment.entity';

@Entity('tuition_fees')
@Check(`amount >= 0`)
export class TuitionFee {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Student, { nullable: true })
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @Column({ type: 'int', nullable: true })
  student_id: number;

  @Column({ type: 'date' })
  period_start: Date;

  @Column({ type: 'date' })
  period_end: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  amount: number;

  @Column({ type: 'date' })
  due_date: Date;

  @Column({ type: 'text', nullable: true })
  description: string;

  @OneToOne(() => Payment, { nullable: true })
  @JoinColumn({ name: 'payment_id' })
  payment: Payment;

  @Column({ type: 'int', nullable: true })
  payment_id: number;
}