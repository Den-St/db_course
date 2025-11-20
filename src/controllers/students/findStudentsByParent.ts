import { Request, Response } from 'express';

import { StudentService } from '../../services/Students.service';

export async function findStudentsByParent(req: Request, res: Response) {
  const service = new StudentService();

  try {
    // Extract parentId from query parameters
    const parentId = req.query.parentId ? parseInt(req.query.parentId as string, 10) : undefined;

    // Fetch students by parent
    const result = await service.findStudentsByParent({ parentId });

    // Return the result
    return res.status(200).json(result);
  } catch (error) {
    // Handle errors
    return res.status(400).json({ message: error.message });
  }
}
