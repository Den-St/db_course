import { Request, Response } from 'express';

import { StudentResponseDTO } from 'dtos/student.dto';

import { StudentService } from '../../services/Students.service';

export async function createStudent(req: Request, res: Response) {
  const service = new StudentService();

  const student = await service.create(req.body);
  return res.status(201).json(new StudentResponseDTO(student));
}
