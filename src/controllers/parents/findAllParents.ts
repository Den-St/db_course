import { Request, Response } from 'express';

import { ParentResponseDTO } from 'dtos/parent.dto';

import { ParentService } from '../../services/Parent.service';

export async function findAllParents(_req: Request, res: Response) {
  const service = new ParentService();
  const parents = await service.findAll();
  return res.json(parents.map((p) => new ParentResponseDTO(p)));
}
