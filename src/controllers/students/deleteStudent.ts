import { Request, Response } from 'express';

import { StudentService } from '../../services/Students.service';

export async function deleteStudent(req: Request, res: Response) {
  const service = new StudentService();
  const deleted = await service.remove(+req.params.id);

  if (!deleted) {
    return res.status(404).json({ message: 'Student not found' });
  }

  return res.status(204).send();
}
