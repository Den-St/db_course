import { Request, Response } from 'express';

import { ParentService } from 'services/Parent.service';

const parentService = new ParentService();

export class ParentController {
  async create(req: Request, res: Response) {
    const parent = await parentService.create(req.body);
    res.status(201).json(parent);
  }

  async findAll(req: Request, res: Response) {
    const parents = await parentService.findAll();
    res.json(parents);
  }

  async findOne(req: Request, res: Response) {
    const parent = await parentService.findOne(+req.params.id);
    res.json(parent);
  }

  async update(req: Request, res: Response) {
    const parent = await parentService.update(+req.params.id, req.body);
    res.json(parent);
  }

  async remove(req: Request, res: Response) {
    await parentService.remove(+req.params.id);
    res.status(204).send();
  }
}
