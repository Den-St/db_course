import { IsNotEmpty, IsNumber, IsOptional, IsString, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateGradeDto {
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  submission_id: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  teacher_id?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100)
  grade?: number;

  @IsOptional()
  @IsString()
  source?: string;
}
