import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Unique } from 'typeorm';

import { Student } from './Student.entity';
import { Course } from './Course.entity';

@Entity('enrollments')
@Unique(['student_id', 'course_id'])
export class Enrollment {
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

  @Column({ type: 'date', default: () => 'CURRENT_DATE' })
  enrollment_date: Date;
}