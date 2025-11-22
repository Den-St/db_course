import { IsNumber, IsDateString, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class GetTuitionFeesByStudentInRangeDto {
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
