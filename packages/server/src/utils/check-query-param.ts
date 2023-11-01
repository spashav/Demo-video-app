import { Request } from 'express';

export const checkQueryParam = (req: Request, param: string) => {
  return Boolean(req.query[param] && req.query[param] !== '0');
};
