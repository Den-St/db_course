import { Request, Response, NextFunction } from 'express';
import { SignInDto } from 'dtos/signin.dto';

export const validateSignIn = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body as SignInDto;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }

  return next();
};
