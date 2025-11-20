import { Request, Response } from 'express';

import { StudentService } from 'services/Students.service';

const studentService = new StudentService();

export const searchStudents = async (req: Request, res: Response) => {
  console.log('req',req);
  const students = await studentService.searchStudents(req.body);
  res.json(students);
};
