import { getRepository } from 'typeorm';
import { CreateTeacherDto, UpdateTeacherDto } from 'dtos/teacher.dto';
import { Teacher } from 'orm/entities/Teacher.entity';

export class TeacherService {
  private teacherRepo = getRepository(Teacher);

  async create(data: CreateTeacherDto) {
    const teacher = this.teacherRepo.create(data);
    return this.teacherRepo.save(teacher);
  }

  async findAll() {
    return this.teacherRepo.find();
  }

  async findOne(id: number) {
    return this.teacherRepo.findOne(id);
  }

  async findByUserId(userId: number) {
    return this.teacherRepo.findOne({ where: { user_id: userId } });
  }

  async update(id: number, data: UpdateTeacherDto) {
    await this.teacherRepo.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number) {
    return this.teacherRepo.delete(id);
  }
}
