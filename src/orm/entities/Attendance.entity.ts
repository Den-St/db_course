import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Unique } from 'typeorm';

import { Student } from './Student.entity';
import { Lesson } from './Lesson.entity';

@Entity('attendance')
@Unique(['student_id', 'lesson_id'])
export class Attendance {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Student, { nullable: true })
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @Column({ type: 'int' })
  student_id: number;

  @ManyToOne(() => Lesson, { nullable: true })
  @JoinColumn({ name: 'lesson_id' })
  lesson: Lesson;

  @Column({ type: 'int' })
  lesson_id: number;

  @Column({ type: 'boolean', default: false })
  attended: boolean;
}