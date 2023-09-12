import { Router, Response } from 'express';
import { awaitTime } from '../utils/await-time';

const sources = [
  {
    //src: 'https://storage.googleapis.com/shaka-demo-assets/bbb-dark-truths-hls/hls.m3u8',
    src: 'https://d2zihajmogu5jn.cloudfront.net/big-buck-bunny/master.m3u8',
    poster: 'https://d2zihajmogu5jn.cloudfront.net/big-buck-bunny/bbb.png',
    type: 'application/x-mpegURL',
  },
  {
    //src: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8',
    src: 'https://d2zihajmogu5jn.cloudfront.net/tears-of-steel/playlist.m3u8',
    poster:
      'https://d2zihajmogu5jn.cloudfront.net/tears-of-steel/tears_of_steel.jpg',
    type: 'application/x-mpegURL',
  },
];

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
      const { id } = req.params;

      send(res, {
        ...sources[parseInt(id, 10) % 2],
        id,
      });
    })
    .use('', (req, res) => {
      res.status(404);
      res.end('No routes matched');
    });

  return router;
};
