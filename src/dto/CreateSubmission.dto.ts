import { IsInt, IsOptional, IsString, IsBoolean } from 'class-validator';

export class CreateSubmissionDto {
  @IsInt()
  assignment_id: number;

  @IsInt()
  student_id: number;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsBoolean()
  is_late?: boolean;

  @IsOptional()
  @IsBoolean()
  feedback_given?: boolean;
}
