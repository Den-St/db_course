import { IsNumber, IsDateString, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class GetTuitionFeesByGroupDto {
  @Type(() => Number)
  @IsNumber()
  group_id: number;

  @IsOptional()
  @IsDateString()
  start_date?: string;

  @IsOptional()
  @IsDateString()
  end_date?: string;
}
