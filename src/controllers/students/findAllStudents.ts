import { Request, Response } from 'express';

import { StudentResponseDTO } from 'dtos/student.dto';

import { StudentService } from '../../services/Students.service';

export async function findAllStudents(_req: Request, res: Response) {
  const service = new StudentService();
  const students = await service.findAll();
  return res.json(students.map((s) => new StudentResponseDTO(s)));
}
