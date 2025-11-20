import { IsInt, IsString, IsOptional, IsNumber, Min, Max } from 'class-validator';

export class UpdateGradeDto {
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
}
