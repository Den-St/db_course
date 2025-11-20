import { IsString, IsEmail, IsNotEmpty, IsIn, IsOptional, IsInt } from 'class-validator';
import { UserRole } from 'orm/entities/User.entity';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsIn(['teacher', 'student', 'parent'])
  role: UserRole;

  @IsString()
  @IsNotEmpty()
  first_name: string;

  @IsString()
  @IsNotEmpty()
  last_name: string;

  @IsOptional()
  @IsInt()
  user_id?: number;

  @IsOptional()
  @IsString()
  specialization?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  hire_date?: string;

  @IsOptional()
  @IsString()
  birth_date?: string;

  @IsOptional()
  @IsInt()
  parent_id?: number;
}
