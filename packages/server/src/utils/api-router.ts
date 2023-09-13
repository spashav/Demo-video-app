import { Router, Response } from 'express';
import { awaitTime } from './await-time';

const sources = [
  {
    //src: 'https://storage.googleapis.com/shaka-demo-assets/bbb-dark-truths-hls/hls.m3u8',
    src: 'https://d2zihajmogu5jn.cloudfront.net/big-buck-bunny/master.m3u8',
    poster: 'https://d2zihajmogu5jn.cloudfront.net/big-buck-bunny/bbb.png',
    type: 'application/x-mpegURL',
    cover: 'https://d2zihajmogu5jn.cloudfront.net/big-buck-bunny/bbb.png',
    title: 'Видео о зайце',
    description: 'Длинное описание видео о зайце',
  },
  {
    //src: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8',
    src: 'https://d2zihajmogu5jn.cloudfront.net/tears-of-steel/playlist.m3u8',
    poster:
      'https://d2zihajmogu5jn.cloudfront.net/tears-of-steel/tears_of_steel.jpg',
    type: 'application/x-mpegURL',
    cover:
      'https://d2zihajmogu5jn.cloudfront.net/tears-of-steel/tears_of_steel.jpg',
    title: 'Видео о роботах',
    description: 'Длинное описание видео о роботах',
  },
];

const send = <Data extends any>(res: Response, data: Data) => {
  res.status(200);
  res.type('application/json');

  res.end(JSON.stringify(data));
};
type Source = (typeof sources)[number];
const getSource = <Keys extends keyof Source>(
  index: number,
  filter: Set<Keys>
) => {
  return Object.fromEntries(
    Object.entries(sources[index % sources.length]).filter(([key]) =>
      filter.has(key as Keys)
    )
  ) as Pick<Source, Keys>;
};

export const initApiRouter = () => {
  const router = Router();

  router
    .get('/feed', async (req, res) => {
      await awaitTime(1000);
      const filter = new Set(['cover'] as const);

      send(
        res,
        Array(100)
          .fill(null)
          .map((_, index) => ({
            id: index.toString(),
            ...getSource(index, filter),
          }))
      );
    })
    .get('/related', async (req, res) => {
      await awaitTime(1000);
      const filter = new Set(['cover'] as const);
      const id = typeof req.query['id'] === 'string' ? req.query['id'] : '0';

      send(
        res,
        Array(100)
          .fill(null)
          .map((_, index) => {
            const relatedId = index + parseInt(id, 10) + 1;
            return {
              id: relatedId.toString(),
              ...getSource(relatedId, filter),
            };
          })
      );
    })
    .get('/watch/:id', async (req, res) => {
      await awaitTime(100);
      const { id } = req.params;
      const filter = new Set(['description', 'title'] as const);

      send(res, {
        ...getSource(parseInt(id, 10), filter),
        id,
      });
    })
    .get('/player_config/:id', async (req, res) => {
      await awaitTime(50);
      const { id } = req.params;
      const filter = new Set(['src', 'poster', 'type'] as const);

      send(res, {
        ...getSource(parseInt(id, 10), filter),
        id,
      });
    })
    .use('', (req, res) => {
      res.status(404);
      res.end('No routes matched');
    });

  return router;
};
