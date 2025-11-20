import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { UserService } from 'services/User.service';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async getMe(req: Request, res: Response) {
    const authToken = req.headers.authorization?.split(' ')[1];

    if (!authToken) {
      return res.status(401).json({ success: false, message: 'Authorization token is required' });
    }

    try {
      const decodedToken = jwt.verify(authToken, '12345') as { userId: string };
      const userInfo = await this.userService.getUserInfo(Number(decodedToken.userId));

      if (!userInfo) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      
      return res.status(200).json({ success: true, data: userInfo });
    } catch (error) {
      console.log('error',error);
      return res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
  }
}