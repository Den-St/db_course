import { Request, Response } from 'express';

import { ParentResponseDTO } from 'dtos/parent.dto';

import { ParentService } from '../../services/Parent.service';

export async function updateParent(req: Request, res: Response) {
  const service = new ParentService();
  const parent = await service.update(+req.params.id, req.body);

  if (!parent) {
    return res.status(404).json({ message: 'Parent not found' });
  }

  return res.json(new ParentResponseDTO(parent));
}
