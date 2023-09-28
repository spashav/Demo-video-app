import { Router } from 'express';
import { awaitTime } from './await-time';
import { sendJson } from './send';

interface Source {
  playerConfig: {
    src: string;
    // Картинка для превью в плеере
    poster: string;
    type: string;
    // Время начала проигрывания видео (чтобы можно было показать первый кадр. и для разнообразия превью)
    startTime: number;
    firstFrame: string;
  };
  //Картинка для превью в ленте
  cover: string;
  title: string;
  description: string;
  states: { progress: number; text: string; cover: string }[];
  duration: number;
  genre: string;
}

const sources: Source[] = [
  {
    playerConfig: {
      src: 'https://storage.googleapis.com/shaka-demo-assets/bbb-dark-truths-hls/hls.m3u8',
      poster: 'https://d2zihajmogu5jn.cloudfront.net/big-buck-bunny/bbb.png',
      type: 'application/x-mpegURL',
      startTime: 0,
      firstFrame: 'server-assets/first-frames/0_0.webp',
    },
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
    duration: 372.333 * 1e3,
    genre: 'Кулинария',
  },
  {
    playerConfig: {
      src: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8',
      poster:
        'https://d2zihajmogu5jn.cloudfront.net/tears-of-steel/tears_of_steel.jpg',
      type: 'application/x-mpegURL',
      startTime: 0,
      firstFrame: 'server-assets/first-frames/1_0.webp'
    },
    cover:
      'https://d2zihajmogu5jn.cloudfront.net/tears-of-steel/tears_of_steel.jpg',
    title: 'Видео о роботах',
    description: 'Длинное описание видео о роботах',
    states: [
      {
        progress: 0,
        cover:
          'https://d2zihajmogu5jn.cloudfront.net/tears-of-steel/tears_of_steel.jpg',
        text: 'Тестовое описание того, что происходит с роботами от 0 до 33%',
      },
      {
        progress: 33,
        cover:
          'https://d2zihajmogu5jn.cloudfront.net/tears-of-steel/tears_of_steel.jpg',
        text: 'Тестовое описание того, что происходит с роботами от 33 до 66%',
      },
      {
        progress: 66,
        cover:
          'https://d2zihajmogu5jn.cloudfront.net/tears-of-steel/tears_of_steel.jpg',
        text: 'Тестовое описание того, что происходит с роботами от 66 до 100%',
      },
    ],
    duration: 734 * 1e3,
    genre: 'Строительство',
  },
];

const getStartTimeAndFirstFrame = (duration: number, index: number) => {
  const startTimeCount = 8;
  const timeShiftPosition = Math.floor(index / sources.length) % startTimeCount;
  const timeShiftRatio = timeShiftPosition / startTimeCount

  return {
    startTime: Math.floor(timeShiftRatio * duration),
    firstFrame: `server-assets/first-frames/${index % sources.length}_${Math.ceil(100 * timeShiftRatio)}.webp`,
  }
};

const getSource = <Keys extends keyof Source>(
  index: number,
  filter: Set<Keys>
) => {
  const source = {
    ...sources[index % sources.length],
  };
  source.playerConfig = {
    ...source.playerConfig,
    ...getStartTimeAndFirstFrame(source.duration, index),
  };
  return Object.fromEntries(
    Object.entries(source).filter(([key]) => filter.has(key as Keys))
  ) as Pick<Source, Keys>;
};

const addIdToPlayerConfig = (
  item: Pick<Source, 'playerConfig'> & { id: string }
) => {
  if (!item.playerConfig) {
    return { ...item };
  }
  return {
    ...item,
    playerConfig: {
      ...item.playerConfig,
      id: item.id,
    },
  };
};

export const initApiRouter = () => {
  const router = Router();

  router
    .get('/feed', async (req, res) => {
      await awaitTime(1000);
      const filter = new Set([
        'cover',
        'title',
        'duration',
        'genre',
        'playerConfig',
      ] as const);
      if (!req.query['usePreloadAndDelayedRelated']) {
        filter.delete('playerConfig');
      }

      sendJson(
        res,
        Array(100)
          .fill(null)
          .map((_, index) => ({
            id: index.toString(),
            ...getSource(index, filter),
          }))
          .map((item) => addIdToPlayerConfig(item))
      );
    })
    .get('/related', async (req, res) => {
      await awaitTime(1000);
      const filter = new Set(['cover', 'playerConfig'] as const);
      const id = typeof req.query['id'] === 'string' ? req.query['id'] : '0';

      if (!req.query['usePreloadAndDelayedRelated']) {
        filter.delete('playerConfig');
      }
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
          .map((item) => addIdToPlayerConfig(item))
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
      const filter = new Set(['playerConfig'] as const);

      const source = {
        ...getSource(parseInt(id, 10), filter),
        id,
      };

      sendJson(res, {
        ...addIdToPlayerConfig(source).playerConfig,
      });
    })
    .use('', (req, res) => {
      res.status(404);
      res.end('No routes matched');
    });

  return router;
};
