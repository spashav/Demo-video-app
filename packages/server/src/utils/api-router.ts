import { Router } from 'express';
import { awaitTime } from './await-time';
import { sendJson } from './send';

interface Source {
  src: string;
  poster: string;
  type: string;
  cover: string;
  title: string;
  description: string;
  states: { progress: number; text: string; cover: string }[];
  duration: number
  genre: string
}

const sources: Source[] = [
  {
    //src: 'https://storage.googleapis.com/shaka-demo-assets/bbb-dark-truths-hls/hls.m3u8',
    src: 'https://d2zihajmogu5jn.cloudfront.net/big-buck-bunny/master.m3u8',
    poster: 'https://d2zihajmogu5jn.cloudfront.net/big-buck-bunny/bbb.png',
    type: 'application/x-mpegURL',
    cover: 'https://d2zihajmogu5jn.cloudfront.net/big-buck-bunny/bbb.png',
    title: 'Видео о зайце',
    description: 'Длинное описание видео о зайце',
    states: [
      {
        progress: 0,
        cover: 'https://d2zihajmogu5jn.cloudfront.net/big-buck-bunny/bbb.png',
        text: 'Заяц от 0 до 12.5%',
      },
      {
        progress: 12.5,
        cover: 'https://d2zihajmogu5jn.cloudfront.net/big-buck-bunny/bbb.png',
        text: 'Заяц от 12.5% до 25%',
      },
      {
        progress: 25,
        cover: 'https://d2zihajmogu5jn.cloudfront.net/big-buck-bunny/bbb.png',
        text: 'Заяц от 25% до 37.5%',
      },
      {
        progress: 37.5,
        cover: 'https://d2zihajmogu5jn.cloudfront.net/big-buck-bunny/bbb.png',
        text: 'Заяц от 37.5% до 50%',
      },
      {
        progress: 50,
        cover: 'https://d2zihajmogu5jn.cloudfront.net/big-buck-bunny/bbb.png',
        text: 'Заяц от 50% до 62.5%',
      },
      {
        progress: 62.5,
        cover: 'https://d2zihajmogu5jn.cloudfront.net/big-buck-bunny/bbb.png',
        text: 'Заяц от 62.5% до 75%',
      },
      {
        progress: 75,
        cover: 'https://d2zihajmogu5jn.cloudfront.net/big-buck-bunny/bbb.png',
        text: 'Заяц от 75% до 87.5%',
      },
      {
        progress: 87.5,
        cover: 'https://d2zihajmogu5jn.cloudfront.net/big-buck-bunny/bbb.png',
        text: 'Заяц от 87.5% до 100%',
      },
    ],
    duration: 635 * 1e3,
    genre: 'Кулинария',
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
    states: [
      {
        progress: 0,
        cover: 'https://d2zihajmogu5jn.cloudfront.net/tears-of-steel/tears_of_steel.jpg',
        text: 'Тестовое описание того, что происходит с роботами от 0 до 33%',
      },
      {
        progress: 33,
        cover: 'https://d2zihajmogu5jn.cloudfront.net/tears-of-steel/tears_of_steel.jpg',
        text: 'Тестовое описание того, что происходит с роботами от 33 до 66%',
      },
      {
        progress: 66,
        cover: 'https://d2zihajmogu5jn.cloudfront.net/tears-of-steel/tears_of_steel.jpg',
        text: 'Тестовое описание того, что происходит с роботами от 66 до 100%',
      },
    ],
    duration: 734 * 1e3,
    genre: 'Строительство',
  },
];

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
  let playerVersion = '1';

  router
    .get('/change-player-version/:version', async (req, res) => {
      const { version } = req.params;
      playerVersion = version;
      sendJson(res, { status: 'ok' });
    })
    .get('/get-player-version', async (req, res) => {
      sendJson(res, { version: playerVersion });
    })
    .get('/feed', async (req, res) => {
      await awaitTime(1000);
      const filter = new Set(['cover' , 'title', 'duration', 'genre'] as const);

      sendJson(
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

      sendJson(
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
      const filter = new Set(['description', 'title', 'states'] as const);

      sendJson(res, {
        ...getSource(parseInt(id, 10), filter),
        id,
      });
    })
    .get('/player_config/:id', async (req, res) => {
      await awaitTime(50);
      const { id } = req.params;
      const filter = new Set(['src', 'poster', 'type'] as const);

      sendJson(res, {
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
