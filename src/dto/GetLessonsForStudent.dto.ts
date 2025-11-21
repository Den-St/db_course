import { IsNotEmpty, IsNumber, IsOptional, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export class GetLessonsForStudentDto {
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  student_id: number;

  @IsOptional()
  @IsDateString()
  start_date?: string;

  @IsOptional()
  @IsDateString()
  end_date?: string;
}
