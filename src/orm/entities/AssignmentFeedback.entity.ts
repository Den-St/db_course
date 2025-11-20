import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';

import { Teacher } from './Teacher.entity';
import { Submission } from './Submission.entity';

@Entity('assignment_feedback')
export class AssignmentFeedback {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Submission, { nullable: true })
  @JoinColumn({ name: 'submission_id' })
  submission: Submission;

  @Column({ type: 'int', unique: true, nullable: true })
  submission_id: number;

  @ManyToOne(() => Teacher, { nullable: true })
  @JoinColumn({ name: 'teacher_id' })
  teacher: Teacher;

  @Column({ type: 'int', nullable: true })
  teacher_id: number;

  @Column({ type: 'text', nullable: true })
  feedback_text: string;

  @CreateDateColumn({ type: 'timestamp' })
  feedback_date: Date;
}