import { IsNotEmpty, IsString, IsInt, IsOptional, IsDateString, IsNumber, MaxLength } from 'class-validator';

export class CreateAssignmentDto {
  @IsInt()
  @IsOptional()
  course_id?: number;

  @IsInt()
  @IsOptional()
  teacher_id?: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  @IsOptional()
  assign_date?: string;

  @IsDateString()
  @IsNotEmpty()
  due_date: string;

  @IsNumber()
  @IsOptional()
  max_grade?: number;
}
