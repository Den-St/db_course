import { getRepository } from 'typeorm';
import { User, UserRole } from 'orm/entities/User.entity';
import { Teacher } from 'orm/entities/Teacher.entity';
import { Parent } from 'orm/entities/Parent.entity';
import { Student } from 'orm/entities/Student.entity';
import { RegisterDto } from 'dtos/register.dto';
import * as bcrypt from 'bcrypt';
import { UserService } from './User.service';
import * as jwt from 'jsonwebtoken';

export class RegisterService {
  private userRepo = getRepository(User);
  private teacherRepo = getRepository(Teacher);
  private parentRepo = getRepository(Parent);
  private studentRepo = getRepository(Student);
  private userService = new UserService();

  async register(data: RegisterDto) {
    const { email, password, role, ...personalData } = data;
    console.log("data",data);
    // Check if user already exists
    const existingUser = await this.userService.findByEmail(email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = this.userRepo.create({ email, password_hash: hashedPassword, role });
    const savedUser = await this.userRepo.save(user);

    // Create role-specific record
    if (role === 'teacher') {
      const teacher = this.teacherRepo.create({ ...personalData, user_id: savedUser.id, full_name: `${personalData.first_name} ${personalData.last_name}` });
      await this.teacherRepo.save(teacher);
    } else if (role === 'parent') {
      const parent = this.parentRepo.create({ ...personalData, user_id: savedUser.id });
      await this.parentRepo.save(parent);
    } else if (role === 'student') {
      const student = this.studentRepo.create({ ...personalData, user_id: savedUser.id,});
      await this.studentRepo.save(student);
    }

    // Generate JWT token
    const token = jwt.sign({ userId: savedUser.id }, '12345', { expiresIn: '10000d' });

    return { success: true, token };
  }
}
