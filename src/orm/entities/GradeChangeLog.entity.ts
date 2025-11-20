import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';

import { Grade } from './Grade.entity';
import { Student } from './Student.entity';
import { Teacher } from './Teacher.entity';

@Entity('grade_changes_log')
export class GradeChangeLog {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Grade, { nullable: true })
  @JoinColumn({ name: 'grade_id' })
  grade: Grade;

  @Column({ type: 'int', nullable: true })
  grade_id: number;

  @ManyToOne(() => Student, { nullable: true })
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @Column({ type: 'int', nullable: true })
  student_id: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  old_grade: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  new_grade: number;

  @CreateDateColumn({ type: 'timestamp' })
  change_date: Date;

  @ManyToOne(() => Teacher, { nullable: true })
  @JoinColumn({ name: 'changed_by_teacher_id' })
  changed_by_teacher: Teacher;

  @Column({ type: 'int', nullable: true })
  changed_by_teacher_id: number;

  @Column({ type: 'text', nullable: true })
  note: string;
}