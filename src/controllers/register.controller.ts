import { Request, Response } from 'express';
import { RegisterService } from 'services/Register.service';

const registerService = new RegisterService();

export class RegisterController {
  async register(req: Request, res: Response) {
    const user = await registerService.register(req.body);
    res.status(201).json(user);
  }
}
