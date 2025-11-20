import { Request, Response } from 'express';

import { AssignParentDto } from 'dtos/student.dto';

import { StudentService } from '../../services/Students.service';

export async function assignParent(req: Request, res: Response) {
  const service = new StudentService();

  try {
    const data: AssignParentDto = req.body;

    const result = await service.assignParent(data);

    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}
