import { getRepository, ILike } from 'typeorm';

import { CreateStudentDto, UpdateStudentDto, AssignParentDto, FindStudentsByParentDto, SearchStudentsDto } from 'dtos/student.dto';
import { Parent } from 'orm/entities/Parent.entity';
import { Student } from 'orm/entities/Student.entity';

export class StudentService {
  private studentRepo = getRepository(Student);
  private parentRepo = getRepository(Parent);

  async create(data: CreateStudentDto) {
    const student = this.studentRepo.create(data);
    return this.studentRepo.save(student);
  }

  async findAll() {
    return this.studentRepo.find({ relations: ['parent'] });
  }

  async findOne(id: number) {
    return this.studentRepo.findOne(id, { relations: ['parent'] });
  }

  async update(id: number, data: UpdateStudentDto) {
    await this.studentRepo.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number) {
    return this.studentRepo.delete(id);
  }

  async assignParent(data: AssignParentDto) {
    const { studentIds, parentId } = data;

    const parent = await this.parentRepo.findOne(parentId);
    if (!parent) {
      throw new Error(`Parent with ID ${parentId} not found`);
    }

    for (const studentId of studentIds) {
      const student = await this.studentRepo.findOne(studentId);
      if (!student) {
        throw new Error(`Student with ID ${studentId} not found`);
      }

      student.parent = parent;
      await this.studentRepo.save(student);
    }

    return { message: 'Parent assigned to students successfully' };
  }

  async findStudentsWithoutParent() {
    return this.studentRepo.find({
      where: { parent: null },
      relations: ['parent'],
    });
  }

  async findStudentsByParent(data: FindStudentsByParentDto) {
    const { parentId } = data;

    // Fetch students without a parent
    const [studentsWithoutParent, studentsWithParent] = await Promise.all([
      this.studentRepo.find({ where: { parent: null } }),
      !!parentId ? this.studentRepo.find({ where: { parent: parentId }, relations: ['parent'] }) : [],
    ]);

    return {
      withoutParent: studentsWithoutParent,
      withParent: studentsWithParent,
    };
  }

  async findByUserId(userId: number) {
    return this.studentRepo.findOne({ where: { user_id: userId }, relations: ['parent'] });
  }

  async searchStudents(data: SearchStudentsDto) {
    console.log("search data",data);
    const { group_id, first_name, last_name, patronym } = data;
    const where: any = {};

    if (group_id) {
      where.group_id = group_id;
    }

    if (first_name) {
      where.first_name = ILike(`%${first_name}%`);
    }

    if (last_name) {
      where.last_name = ILike(`%${last_name}%`);
    }

    if (patronym) {
      where.patronym = ILike(`%${patronym}%`);
    }

    return this.studentRepo.find({
      where,
      relations: ['parent', 'group'],
    });
  }
}
