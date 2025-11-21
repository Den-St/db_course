import { Request, Response } from 'express';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { AttendanceService } from '../services/attendance.service';
import { CreateAttendanceDto } from '../dto/CreateAttendance.dto';
import { UpdateAttendanceDto } from '../dto/UpdateAttendance.dto';
import { FindAttendanceDto } from '../dto/FindAttendance.dto';
import { GetStudentAttendancesInRangeDto } from '../dto/GetStudentAttendancesInRange.dto';

export class AttendanceController {
  private attendanceService: AttendanceService;

  constructor() {
    this.attendanceService = new AttendanceService();
  }

  createAttendance = async (req: Request, res: Response): Promise<void> => {
    try {
      const createAttendanceDto = plainToClass(CreateAttendanceDto, req.body);

      const errors = await validate(createAttendanceDto);
      if (errors.length > 0) {
        const errorMessages = errors.map(error => 
          Object.values(error.constraints || {})
        ).flat();
        res.status(400).json({ 
          success: false,
          errors: errorMessages 
        });
        return;
      }

      const attendance = await this.attendanceService.createAttendance(createAttendanceDto);

      res.status(201).json({
        success: true,
        data: attendance,
        message: 'Attendance created successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to create attendance'
      });
    }
  };

  updateAttendance = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const updateAttendanceDto = plainToClass(UpdateAttendanceDto, req.body);

      const errors = await validate(updateAttendanceDto);
      if (errors.length > 0) {
        const errorMessages = errors.map(error => 
          Object.values(error.constraints || {})
        ).flat();
        res.status(400).json({ 
          success: false,
          errors: errorMessages 
        });
        return;
      }

      const attendance = await this.attendanceService.updateAttendance(Number(id), updateAttendanceDto);

      res.status(200).json({
        success: true,
        data: attendance,
        message: 'Attendance updated successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to update attendance'
      });
    }
  };

  findAttendance = async (req: Request, res: Response): Promise<void> => {
    try {
      const findAttendanceDto = plainToClass(FindAttendanceDto, req.query);

      const errors = await validate(findAttendanceDto);
      if (errors.length > 0) {
        const errorMessages = errors.map(error => 
          Object.values(error.constraints || {})
        ).flat();
        res.status(400).json({ 
          success: false,
          errors: errorMessages 
        });
        return;
      }

      const attendances = await this.attendanceService.findAttendance(findAttendanceDto);

      res.status(200).json({
        success: true,
        data: attendances,
        message: 'Attendance records retrieved successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to retrieve attendance records'
      });
    }
  };

  getStudentAttendancesInRange = async (req: Request, res: Response): Promise<void> => {
    try {
      const getStudentAttendancesDto = plainToClass(GetStudentAttendancesInRangeDto, req.query);

      const errors = await validate(getStudentAttendancesDto);
      if (errors.length > 0) {
        const errorMessages = errors.map(error => 
          Object.values(error.constraints || {})
        ).flat();
        res.status(400).json({ 
          success: false,
          errors: errorMessages 
        });
        return;
      }

      const { student_id, start_date, end_date, course_id } = getStudentAttendancesDto;
      const result = await this.attendanceService.getStudentAttendancesInRange(student_id, start_date, end_date, course_id);

      res.status(200).json({
        success: true,
        data: result,
        message: 'Student attendances retrieved successfully'
      });
    } catch (error) {
      const status = error.message.includes('not found') ? 404 : 500;
      res.status(status).json({
        success: false,
        message: error.message || 'Failed to retrieve student attendances'
      });
    }
  };
}
