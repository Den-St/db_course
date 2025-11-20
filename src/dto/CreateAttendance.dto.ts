import { IsInt, IsBoolean, IsOptional } from 'class-validator';

export class CreateAttendanceDto {
  @IsInt()
  student_id: number;

  @IsInt()
  lesson_id: number;

  @IsBoolean()
  @IsOptional()
  attended?: boolean;
}
