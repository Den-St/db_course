import { Request, Response } from 'express';

import { StudentService } from '../../services/Students.service';

export async function findStudentsWithoutParent(req: Request, res: Response) {
  const service = new StudentService();
  try {
    // Fetch students without a parent
    const students = await service.findStudentsWithoutParent();

    // Return the students
    return res.status(200).json(students);
  } catch (error) {
    // Handle errors
    return res.status(400).json({ message: error.message });
  }
}
