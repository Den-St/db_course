import { getRepository } from 'typeorm';
import { User } from 'orm/entities/User.entity';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

export class AuthService {
  private userRepo = getRepository(User);

  async signIn(email: string, password: string) {
    // Find user by email
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, '12345', { expiresIn: '10000d' });

    return { success: true, token };
  }
}
