import { Request, Response } from 'express';

import { ParentResponseDTO } from 'dtos/parent.dto';

import { ParentService } from '../../services/Parent.service';

export async function createParent(req: Request, res: Response) {
  const service = new ParentService();
  const parent = await service.create(req.body);
  return res.status(201).json(new ParentResponseDTO(parent));
}
