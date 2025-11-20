import { Request, Response, NextFunction } from 'express';
import { isEmpty, isMobilePhone, isDate } from 'validator';

export async function validateCreateStudent(req: Request, _res: Response, next: NextFunction) {
  const { first_name, last_name, birth_date, phone, parent } = req.body;

  if (isEmpty(first_name || '')) return next(new Error('first_name is required'));
  if (isEmpty(last_name || '')) return next(new Error('last_name is required'));
  if (!isDate(birth_date || '')) return next(new Error('birth_date must be a valid date'));
  if (!parent) return next(new Error('parent_id is required'));

  return next();
}
