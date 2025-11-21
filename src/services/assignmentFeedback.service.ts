import { AssignmentFeedback } from '../orm/entities/AssignmentFeedback.entity';
import { Submission } from '../orm/entities/Submission.entity';
import { Teacher } from '../orm/entities/Teacher.entity';
import { Student } from '../orm/entities/Student.entity';
import { Course } from '../orm/entities/Course.entity';
import { CreateAssignmentFeedbackDto } from '../dto/CreateAssignmentFeedback.dto';
import { UpdateAssignmentFeedbackDto } from '../dto/UpdateAssignmentFeedback.dto';
import { getRepository } from 'typeorm';

export class AssignmentFeedbackService {
  private feedbackRepository = getRepository(AssignmentFeedback);
  private submissionRepository = getRepository(Submission);
  private teacherRepository = getRepository(Teacher);
  private studentRepository = getRepository(Student);
  private courseRepository = getRepository(Course);

  async createFeedback(createFeedbackDto: CreateAssignmentFeedbackDto): Promise<AssignmentFeedback> {
    const { submission_id, teacher_id, feedback_text } = createFeedbackDto;

    // Verify submission exists
    const submission = await this.submissionRepository.findOne({
      where: { id: submission_id }
    });

    if (!submission) {
      throw new Error('Submission not found');
    }

    // Verify teacher exists
    const teacher = await this.teacherRepository.findOne({
      where: { id: teacher_id }
    });

    if (!teacher) {
      throw new Error('Teacher not found');
    }

    const feedback = this.feedbackRepository.create({
      submission_id,
      teacher_id,
      feedback_text
    });

    const savedFeedback = await this.feedbackRepository.save(feedback);

    // Update submission feedback_given flag
    submission.feedback_given = true;
    await this.submissionRepository.save(submission);

    return savedFeedback;
  }

  async updateFeedback(id: number, updateFeedbackDto: UpdateAssignmentFeedbackDto): Promise<AssignmentFeedback> {
    const { feedback_text } = updateFeedbackDto;

    const feedback = await this.feedbackRepository.findOne({ where: { id } });
    if (!feedback) {
      throw new Error('Feedback not found');
    }

    if (feedback_text !== undefined) {
      feedback.feedback_text = feedback_text;
    }

    return await this.feedbackRepository.save(feedback);
  }

  async getFeedbackBySubmission(submission_id: number): Promise<AssignmentFeedback[]> {
    const submission = await this.submissionRepository.findOne({
      where: { id: submission_id }
    });

    if (!submission) {
      throw new Error('Submission not found');
    }

    return await this.feedbackRepository.find({
      where: { submission_id },
      relations: ['teacher', 'teacher.user'],
      order: {'feedback_date': 'DESC'}
    });
  }

  async deleteFeedback(id: number): Promise<void> {
    const feedback = await this.feedbackRepository.findOne({
      where: { id }
    });

    if (!feedback) {
      throw new Error('Feedback not found');
    }

    const submission_id = feedback.submission_id;
    await this.feedbackRepository.remove(feedback);

    // Check if there are any remaining feedbacks for this submission
    const remainingFeedbacks = await this.feedbackRepository.count({
      where: { submission_id }
    });

    // Update submission feedback_given flag if no feedbacks remain
    if (remainingFeedbacks === 0) {
      const submission = await this.submissionRepository.findOne({
        where: { id: submission_id }
      });
      if (submission) {
        submission.feedback_given = false;
        await this.submissionRepository.save(submission);
      }
    }
  }

  async getStudentFeedbacksInRange(student_id: number, start_date: string, end_date: string, course_id?: number): Promise<{ feedbacks: AssignmentFeedback[], count: number }> {
    // Verify student exists
    const student = await this.studentRepository.findOne({
      where: { id: student_id }
    });

    if (!student) {
      throw new Error('Student not found');
    }

    // Verify course exists if provided
    if (course_id !== undefined) {
      const course = await this.courseRepository.findOne({
        where: { id: course_id }
      });

      if (!course) {
        throw new Error('Course not found');
      }
    }

    // Build query
    const query = this.feedbackRepository
      .createQueryBuilder('feedback')
      .innerJoin('feedback.submission', 'submission')
      .innerJoin('submission.assignment', 'assignment')
      .leftJoinAndSelect('feedback.teacher', 'teacher')
      .leftJoinAndSelect('teacher.user', 'user')
      .leftJoinAndSelect('assignment.course', 'course')
      .where('submission.student_id = :student_id', { student_id })
      .andWhere('feedback.feedback_date >= :start_date', { start_date })
      .andWhere('feedback.feedback_date <= :end_date', { end_date });

    // Add course filter if provided
    if (course_id !== undefined) {
      query.andWhere('assignment.course_id = :course_id', { course_id });
    }

    const feedbacks = await query
      .orderBy('feedback.feedback_date', 'DESC')
      .getMany();

    return {
      feedbacks,
      count: feedbacks.length
    };
  }
}
