import { IsString, IsEmail, IsOptional, IsInt } from 'class-validator';

import { Parent } from '../orm/entities/Parent.entity';

import { StudentResponseDTO } from './student.dto';

export class ParentResponseDTO {
  id: number;
  userId: number;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  children?: StudentResponseDTO[];

  constructor(parent: Parent) {
    this.id = parent.id;
    this.userId = parent.user_id;
    this.firstName = parent.first_name;
    this.lastName = parent.last_name;
    this.phone = parent.phone;

    if (parent.children) {
      this.children = parent.children.map((child) => new StudentResponseDTO(child));
    }
  }
}

export class CreateParentDto {
  @IsInt()
  user_id: number;

  @IsString()
  first_name: string;

  @IsString()
  last_name: string;

  @IsString()
  phone: string;

  @IsEmail()
  email: string;
}

export class UpdateParentDto {
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
  phone?: string;

  @IsOptional()
  @IsEmail()
  email?: string;
}
