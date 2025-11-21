import { IsInt, IsString, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAssignmentFeedbackDto {
  @IsInt()
  @Type(() => Number)
  @IsNotEmpty()
  submission_id: number;

  @IsInt()
  @Type(() => Number)
  @IsNotEmpty()
  teacher_id: number;

  @IsString()
  @IsNotEmpty()
  feedback_text: string;
}
