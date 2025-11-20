import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, Check, OneToOne } from 'typeorm';

import { Student } from './Student.entity';
import { Course } from './Course.entity';
import { Teacher } from './Teacher.entity';
import { Submission } from './Submission.entity';

@Entity('grades')
@Check(`grade >= 0 AND grade <= 100`)
export class Grade {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Student, { nullable: true })
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @Column({ type: 'int' })
  student_id: number;

  @ManyToOne(() => Course, { nullable: true })
  @JoinColumn({ name: 'course_id' })
  course: Course;

  @Column({ type: 'int' })
  course_id: number;

  @ManyToOne(() => Teacher, { nullable: true })
  @JoinColumn({ name: 'teacher_id' })
  teacher: Teacher;

  @Column({ type: 'int', nullable: true })
  teacher_id: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  grade: number;

  @CreateDateColumn({ type: 'timestamp' })
  date_given: Date;

  @Column({ type: 'varchar', length: 50, nullable: true })
  source: string;

  @OneToOne(() => Submission, submission => submission.grade, {nullable: true})
  submission: Submission;

  @Column({ type: 'int', nullable: true })
  submission_id: number;
}