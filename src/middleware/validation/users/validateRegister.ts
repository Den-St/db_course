import { Request, Response, NextFunction } from 'express';
import { validate } from 'class-validator';
import { RegisterDto } from 'dtos/register.dto';
import { plainToInstance } from 'class-transformer';

export async function validateRegister(req: Request, res: Response, next: NextFunction) {
  const registerDto = plainToInstance(RegisterDto, req.body);
  const errors = await validate(registerDto);

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  return next();
}
