import { IsString, IsDateString, IsOptional, IsInt, IsArray, IsDecimal } from 'class-validator';

import { Student } from '../orm/entities/Student.entity';

export class StudentResponseDTO {
  id: number;
  firstName: string;
  lastName: string;
  birthDate: string;
  phone: string;
  parentId: number;
  groupId?: number;
  averageGrade?: number;

  constructor(student: Student) {
    this.id = student.id;
    this.firstName = student.first_name;
    this.lastName = student.last_name;
    this.birthDate = student.birth_date.toString();
    this.phone = student.phone;
    this.parentId = student.parent?.id ?? 0;
    this.groupId = student.group?.id;
    this.averageGrade = student.average_grade;
  }
}

export class CreateStudentDto {
  @IsString()
  first_name: string;

  @IsString()
  last_name: string;

  @IsDateString()
  birth_date: string;

  @IsString()
  phone: string;

  @IsInt()
  parent_id: number;

  @IsOptional()
  @IsInt()
  group_id?: number;

  @IsOptional()
  @IsDecimal()
  average_grade?: number;
}

export class UpdateStudentDto {
  @IsOptional()
  @IsString()
  first_name?: string;

  @IsOptional()
  @IsString()
  last_name?: string;

  @IsOptional()
  @IsDateString()
  birth_date?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsInt()
  parent_id?: number;

  @IsOptional()
  @IsInt()
  group_id?: number;

  @IsOptional()
  @IsDecimal()
  average_grade?: number;
}

export class AssignParentDto {
  @IsArray()
  @IsInt({ each: true })
  studentIds: number[];

  @IsInt()
  parentId: number;
}

export class FindStudentsByParentDto {
  @IsOptional()
  @IsInt()
  parentId?: number;
}

export class SearchStudentsDto {
  @IsOptional()
  @IsInt()
  group_id?: number;

  @IsOptional()
  @IsString()
  first_name?: string;

  @IsOptional()
  @IsString()
  last_name?: string;

  @IsOptional()
  @IsString()
  patronym?: string;
}