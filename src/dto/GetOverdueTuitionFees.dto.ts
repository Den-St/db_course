import { IsNumber, IsDateString, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class GetOverdueTuitionFeesDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  group_id?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  student_id?: number;

  @IsOptional()
  @IsDateString()
  start_date?: string;

  @IsOptional()
  @IsDateString()
  end_date?: string;
}
