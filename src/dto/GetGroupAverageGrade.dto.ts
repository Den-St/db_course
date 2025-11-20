import { IsNotEmpty, IsInt, IsDateString, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class GetGroupAverageGradeDto {
  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  group_id: number;

  @IsNotEmpty()
  @IsDateString()
  start_date: string;

  @IsNotEmpty()
  @IsDateString()
  end_date: string;
}
