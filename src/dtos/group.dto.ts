import { IsString, IsInt, IsOptional, Min, Max, Length } from 'class-validator';

export class CreateGroupDto {
  @IsString()
  @Length(1, 100)
  name: string;

  @IsInt()
  @Min(1)
  @Max(11)
  grade_level: number;

  @IsInt()
  @Min(1900)
  @Max(2100)
  @IsOptional()
  start_year?: number;

  @IsInt()
  @IsOptional()
  curator_id?: number;
}
