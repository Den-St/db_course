import { IsNumber, IsOptional, IsString, IsDateString, Min } from 'class-validator';

export class CreateTuitionFeeDto {
  @IsOptional()
  @IsNumber()
  student_id?: number;

  @IsDateString()
  period_start: string;

  @IsDateString()
  period_end: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  amount?: number;

  @IsDateString()
  due_date: string;

  @IsOptional()
  @IsString()
  description?: string;
}
