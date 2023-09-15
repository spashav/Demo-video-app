import { Response } from 'express';

interface SendParams {
  res: Response;
  body?: string;
  status?: number;
  type?: string;
}

export function send({
  res,
  status = 200,
  type = 'text/html',
  body,
}: SendParams): void {
  res
    .status(status)
    .type(type)
    .header('Cache-Control', 'private, no-cache, no-store, must-revalidate')
    .header('Expires', '-1')
    .header('Pragma', 'no-cache');

  res.end(body);
}

export const sendJson = <Data extends any>(res: Response, data: Data) => {
  send({
    body: JSON.stringify(data),
    type: 'application/json',
    res,
  });
};
