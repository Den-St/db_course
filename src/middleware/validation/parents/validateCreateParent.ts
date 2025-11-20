import { Request, Response, NextFunction } from 'express';
import { isEmpty, isEmail, isMobilePhone, isInt } from 'validator';

export async function validateCreateParent(req: Request, _res: Response, next: NextFunction) {
  const { user_id, first_name, last_name, phone, email } = req.body;

  if (!isInt(user_id?.toString() || '')) {
    return next(new Error('user_id must be a valid integer'));
  }

  if (isEmpty(first_name || '')) {
    return next(new Error('first_name is required'));
  }

  if (isEmpty(last_name || '')) {
    return next(new Error('last_name is required'));
  }

  if (!isMobilePhone(phone || '', 'any')) {
    return next(new Error('phone must be a valid mobile number'));
  }

  if (!isEmail(email || '')) {
    return next(new Error('email must be valid'));
  }

  return next();
}
