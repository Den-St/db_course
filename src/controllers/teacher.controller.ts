import { Request, Response } from 'express';
import { TeacherService } from 'services/Teachers.service';

const teacherService = new TeacherService();

export class TeacherController {
  async create(req: Request, res: Response) {
    const teacher = await teacherService.create(req.body);
    res.status(201).json(teacher);
  }

  async findAll(req: Request, res: Response) {
    const teachers = await teacherService.findAll();
    res.json(teachers);
  }

  async findOne(req: Request, res: Response) {
    const teacher = await teacherService.findOne(+req.params.id);
    res.json(teacher);
  }

  async update(req: Request, res: Response) {
    const teacher = await teacherService.update(+req.params.id, req.body);
    res.json(teacher);
  }

  async remove(req: Request, res: Response) {
    await teacherService.remove(+req.params.id);
    res.status(204).send();
  }
}
