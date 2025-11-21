import { Router } from 'express';
import { AttendanceController } from '../controllers/attendance.controller';
import { catchAsync } from 'utils/catchAsync';

const router = Router();
const attendanceController = new AttendanceController();

router.get('/', catchAsync(attendanceController.findAttendance));
router.post('/create', catchAsync(attendanceController.createAttendance));
router.put('/:id', catchAsync(attendanceController.updateAttendance));
router.get('/student-range', catchAsync(attendanceController.getStudentAttendancesInRange));

export default router;
