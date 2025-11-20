import { IsInt, IsString, IsOptional, IsNumber, Min, Max } from 'class-validator';

export class CreateGradeDto {
  @IsInt()
  student_id: number;

  @IsInt()
  course_id: number;

  @IsInt()
  @IsOptional()
  teacher_id?: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(100)
  @IsOptional()
  grade?: number;

  @IsString()
  @IsOptional()
  source?: string;

  @IsInt()
  submission_id: number;
}
