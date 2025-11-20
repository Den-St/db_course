import { Request, Response } from 'express';

import { ParentService } from '../../services/Parent.service';

export async function deleteParent(req: Request, res: Response) {
  const service = new ParentService();
  const deleted = await service.remove(+req.params.id);

  if (!deleted) {
    return res.status(404).json({ message: 'Parent not found' });
  }

  return res.status(204).send(); // No content
}
