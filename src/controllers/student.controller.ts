import { Request, Response } from 'express';

import { StudentService } from 'services/Students.service';

const studentService = new StudentService();

export class StudentController {
  async create(req: Request, res: Response) {
    const student = await studentService.create(req.body);
    res.status(201).json(student);
  }

  async findAll(req: Request, res: Response) {
    const students = await studentService.findAll();
    res.json(students);
  }

  async findOne(req: Request, res: Response) {
    const student = await studentService.findOne(+req.params.id);
    res.json(student);
  }

  async update(req: Request, res: Response) {
    const student = await studentService.update(+req.params.id, req.body);
    res.json(student);
  }

  async remove(req: Request, res: Response) {
    await studentService.remove(+req.params.id);
    res.status(204).send();
  }

  async search(req: Request, res: Response) {
    const students = await studentService.searchStudents(req.body);
    res.json(students);
  }
}
