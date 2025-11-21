import { IsString, IsOptional } from 'class-validator';

export class UpdateAssignmentFeedbackDto {
  @IsString()
  @IsOptional()
  feedback_text?: string;
}
