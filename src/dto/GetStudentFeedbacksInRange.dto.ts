import { IsInt, IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class GetStudentFeedbacksInRangeDto {
  @IsInt()
  @Type(() => Number)
  @IsNotEmpty()
  student_id: number;

  @IsString()
  @IsNotEmpty()
  start_date: string;

  @IsString()
  @IsNotEmpty()
  end_date: string;

  @IsInt()
  @Type(() => Number)
  @IsOptional()
  course_id?: number;
}
