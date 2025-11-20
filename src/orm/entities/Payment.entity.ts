import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Check } from 'typeorm';

import { Student } from './Student.entity';
import { TuitionFee } from './TuitionFee.entity';

@Entity('payments')
@Check(`amount_paid >= 0`)
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Student, { nullable: true })
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @Column({ type: 'int', nullable: true })
  student_id: number;

  @ManyToOne(() => TuitionFee, { nullable: true })
  @JoinColumn({ name: 'tuition_fee_id' })
  tuition_fee: TuitionFee;

  @Column({ type: 'int', nullable: true })
  tuition_fee_id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  amount_paid: number;

  @Column({ type: 'date', default: () => 'CURRENT_DATE' })
  payment_date: Date;

  @Column({ type: 'varchar', length: 50, nullable: true })
  payment_method: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  receipt_reference: string;
}