import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

import { Teacher } from './Teacher.entity';

@Entity('groups')
export class Group {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  name: string;

  @Column({ type: 'int' })
  grade_level: number;

  @Column({ type: 'int', nullable: true })
  start_year: number;

  @ManyToOne(() => Teacher, { nullable: true })
  @JoinColumn({ name: 'curator_id' })
  curator: Teacher;
}