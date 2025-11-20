import { Request, Response } from 'express';

import { StudentResponseDTO } from 'dtos/student.dto';

import { StudentService } from '../../services/Students.service';

export async function findOneStudent(req: Request, res: Response) {
  const service = new StudentService();
  const student = await service.findOne(+req.params.id);

  if (!student) {
    return res.status(404).json({ message: 'Student not found' });
  }

  return res.json(new StudentResponseDTO(student));
}
