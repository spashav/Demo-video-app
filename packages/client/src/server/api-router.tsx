import { Router, Response } from 'express';
import { awaitTime } from '../utils/await-time';

const send = <Data extends any>(res: Response, data: Data) => {
  res.status(200);
  res.type('application/json');

  res.end(JSON.stringify(data));
};

export const initApiRouter = () => {
  const router = Router();

  router
    .get('/related', async (req, res) => {
      await awaitTime(1000);

      send(res, [
        {
          id: '1',
        },
      ]);
    })
    .get('/watch', async (req, res) => {
      await awaitTime(100);

      send(res, {
        description: 'Фильм',
      });
    })
    .get('/player_config/:id', async (req, res) => {
      await awaitTime(50);

      send(res, {
        manifest: '...',
        id: req.params.id,
      });
    })
    .use('', (req, res) => {
      res.status(404);
      res.end('No routes matched');
    });

  return router;
};
