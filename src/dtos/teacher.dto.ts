import { IsString, IsInt, IsOptional, IsPhoneNumber, IsDateString } from 'class-validator';
import { Teacher } from '../orm/entities/Teacher.entity';

export class TeacherResponseDTO {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  specialization?: string;
  contactPhone?: string;
  hireDate: string;

  constructor(teacher: Teacher) {
    this.id = teacher.id;
    this.firstName = teacher.first_name;
    this.lastName = teacher.last_name;
    this.fullName = teacher.full_name;
    this.specialization = teacher.specialization;
    this.contactPhone = teacher.contact_phone;
    this.hireDate = teacher.hire_date.toISOString();
  }
}

export class CreateTeacherDto {
  @IsInt()
  user_id: number;

  @IsString()
  first_name: string;

  @IsString()
  last_name: string;

  @IsString()
  full_name: string;

  @IsOptional()
  @IsString()
  specialization?: string;

  @IsOptional()
  @IsPhoneNumber()
  contact_phone?: string;

  @IsOptional()
  @IsDateString()
  hire_date?: string;
}

export class UpdateTeacherDto {
  @IsOptional()
  @IsInt()
  user_id?: number;

  @IsOptional()
  @IsString()
  first_name?: string;

  @IsOptional()
  @IsString()
  last_name?: string;

  @IsOptional()
  @IsString()
  full_name?: string;

  @IsOptional()
  @IsString()
  specialization?: string;

  @IsOptional()
  @IsPhoneNumber()
  contact_phone?: string;

  @IsOptional()
  @IsDateString()
  hire_date?: string;
}
