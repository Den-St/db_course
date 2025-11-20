import { IsOptional, IsInt, IsString, IsBoolean, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export class FilterSubmissionDto {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  assignment_id?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  student_id?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  group_id?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  teacher_id?: number;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  is_late?: boolean;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  feedback_given?: boolean;

  @IsOptional()
  @IsDateString()
  submitted_from?: string;

  @IsOptional()
  @IsDateString()
  submitted_to?: string;
}