import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, Check, OneToMany } from 'typeorm';

import { Parent } from './Parent.entity';
import { User } from './User.entity';
import { Group } from './Group.entity';
import { TuitionFee } from './TuitionFee.entity';

@Entity('students')
@Check(`EXTRACT(YEAR FROM AGE(birth_date)) >= 6`)
export class Student {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'int', unique: true })
  user_id: number;

  @Column({ type: 'varchar', length: 50 })
  patronym: string;

  @Column({ type: 'varchar', length: 50 })
  first_name: string;

  @Column({ type: 'varchar', length: 50 })
  last_name: string;

  @Column({ type: 'date' })
  birth_date: Date;

  @ManyToOne(() => Parent, (parent) => parent.children, { nullable: false })
  @JoinColumn({ name: 'parent_id' })
  parent: Parent;

  @Column({ type: 'int', nullable: false })
  parent_id: number;

  @ManyToOne(() => Group, { nullable: true })
  @JoinColumn({ name: 'group_id' })
  group: Group;

  @Column({ type: 'int', nullable: true })
  group_id: number;

  @Column({ type: 'varchar', length: 20, unique: true, nullable: true })
  phone: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  average_grade: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @OneToMany(() => TuitionFee,(fee) => fee.student_id, { nullable: true })
  @JoinColumn({ name: 'tuition_fee_id' })
  tuition_fee: TuitionFee;

  @Column({ type: 'int', nullable: true })
  tuition_fee_id: number;
}