import { Request, Response, NextFunction } from 'express';
import { isEmpty, isInt, isMobilePhone } from 'validator';

export async function validateCreateTeacher(req: Request, _res: Response, next: NextFunction) {
  const { user_id, first_name, last_name, full_name, contact_phone } = req.body;

  if (!isInt(user_id?.toString() || '')) {
    return next(new Error('user_id must be a valid integer'));
  }

  if (isEmpty(first_name || '')) {
    return next(new Error('first_name is required'));
  }

  if (isEmpty(last_name || '')) {
    return next(new Error('last_name is required'));
  }

  if (isEmpty(full_name || '')) {
    return next(new Error('full_name is required'));
  }

  if (contact_phone && !isMobilePhone(contact_phone, 'any')) {
    return next(new Error('contact_phone must be a valid phone number'));
  }

  return next();
}
