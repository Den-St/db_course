import { Request, Response } from 'express';
import { AuthService } from 'services/Auth.service';

const authService = new AuthService();

export class AuthController {
  async signIn(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const result = await authService.signIn(email, password);
      res.status(200).json(result);
    } catch (error) {
      res.status(401).json({ success: false, message: error.message });
    }
  }
}
