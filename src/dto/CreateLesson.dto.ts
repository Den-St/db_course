import { IsNotEmpty, IsNumber, IsString, IsDateString, IsOptional, MaxLength, Matches } from 'class-validator';

export class CreateLessonDto {
  @IsNotEmpty({ message: 'Course ID is required' })
  @IsNumber({}, { message: 'Course ID must be a number' })
  course_id: number;

  @IsNotEmpty({ message: 'Teacher ID is required' })
  @IsNumber({}, { message: 'Teacher ID must be a number' })
  teacher_id: number;

  @IsNotEmpty({ message: 'Lesson date is required' })
  @IsDateString({}, { message: 'Lesson date must be a valid date' })
  lesson_date: string;

  @IsOptional()
  @IsString({ message: 'Start time must be a string' })
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/, { message: 'Start time must be in HH:MM or HH:MM:SS format' })
  start_time?: string;

  @IsOptional()
  @IsString({ message: 'End time must be a string' })
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/, { message: 'End time must be in HH:MM or HH:MM:SS format' })
  end_time?: string;

  @IsOptional()
  @IsString({ message: 'Topic must be a string' })
  @MaxLength(200, { message: 'Topic must not exceed 200 characters' })
  topic?: string;
}
