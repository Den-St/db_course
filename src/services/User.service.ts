import { getRepository } from 'typeorm';
import { User } from 'orm/entities/User.entity';
import { ParentService } from './Parent.service';
import { StudentService } from './Students.service';
import { TeacherService } from './Teachers.service';

export class UserService {
  private userRepo = getRepository(User);
  private parentService = new ParentService();
  private studentService = new StudentService();
  private teacherService = new TeacherService();

  async findByEmail(email: string): Promise<User | undefined> {
    return this.userRepo.findOne({ where: { email } });
  }

  async findById(id: number): Promise<User | undefined> {
    return this.userRepo.findOne({
      where: { id },
    });
  }

  async getUserInfo(id: number): Promise<any> {
    const user = await this.userRepo.findOne({ where: { id } });

    if (!user) {
      return null;
    }

    // Remove password_hash from user object
    const { password_hash, ...userWithoutPassword } = user;

    switch (user.role) {
      case 'parent':
        const parentData = await this.parentService.findByUserId(id);
        return { ...userWithoutPassword, ...parentData };
      case 'student':
        const studentData = await this.studentService.findByUserId(id);
        return { ...userWithoutPassword, ...studentData };
      case 'teacher':
        const teacherData = await this.teacherService.findByUserId(id);
        return { ...userWithoutPassword, ...teacherData };
      default:
        return userWithoutPassword;
    }
  }
}
