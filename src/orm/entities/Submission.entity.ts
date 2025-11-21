import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, Check, Unique, OneToOne } from 'typeorm';

import { Assignment } from './Assignment.entity';
import { Student } from './Student.entity';
import { Grade } from './Grade.entity';

@Entity('submissions')
@Unique(['assignment_id', 'student_id'])
export class Submission {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Assignment, { nullable: true })
  @JoinColumn({ name: 'assignment_id' })
  assignment: Assignment;

  @Column({ type: 'int' })
  assignment_id: number;

  @ManyToOne(() => Student, { nullable: true })
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @Column({ type: 'int' })
  student_id: number;

  @CreateDateColumn({ type: 'timestamp' })
  submitted_at: Date;

  @Column({ type: 'text', nullable: true })
  content: string;

  @OneToOne(() => Grade, grade => grade.submission, { nullable: true })
  @JoinColumn({ name: 'grade_id' })
  grade: Grade;

  @Column({ type: 'int', nullable: true })
  grade_id: number;

  @Column({ type: 'boolean', default: false })
  is_late: boolean;

  @Column({ type: 'boolean', default: false })
  feedback_given: boolean;
}