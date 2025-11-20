import { MigrationInterface, QueryRunner, getRepository } from 'typeorm';

import { Parent } from '../entities/Parent.entity';
import { Student } from '../entities/Student.entity';

export class SeedParentsAndStudents1759870000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const parentRepo = getRepository(Parent);
    const studentRepo = getRepository(Student);

    // --- Parents ---
    const parents = [
      parentRepo.create({
        first_name: 'Олександр',
        last_name: 'Іваненко',
        phone: '+380501234567',
        email: 'ivanenko@example.com',
      }),
      parentRepo.create({
        first_name: 'Наталія',
        last_name: 'Петренко',
        phone: '+380671112233',
        email: 'petrenko@example.com',
      }),
      parentRepo.create({
        first_name: 'Сергій',
        last_name: 'Коваль',
        phone: '+380931234321',
        email: 'koval@example.com',
      }),
    ];

    await parentRepo.save(parents);
    console.log('✅ Parents seeded');

    // --- Students ---
    const students = [
      studentRepo.create({
        first_name: 'Андрій',
        last_name: 'Іваненко',
        birth_date: '2010-05-15',
        phone: '+380931111111',
        parent: parents[0],
      }),
      studentRepo.create({
        first_name: 'Марія',
        last_name: 'Петренко',
        birth_date: '2011-03-22',
        phone: '+380672222222',
        parent: parents[1],
      }),
      studentRepo.create({
        first_name: 'Дмитро',
        last_name: 'Коваль',
        birth_date: '2009-12-01',
        phone: '+380503333333',
        parent: parents[2],
      }),
    ];

    await studentRepo.save(students);
    console.log('✅ Students seeded');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const studentRepo = getRepository(Student);
    const parentRepo = getRepository(Parent);

    await studentRepo.delete({});
    await parentRepo.delete({});

    console.log('🗑️ Seed data removed');
  }
}
