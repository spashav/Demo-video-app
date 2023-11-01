import { Router } from 'express';
import { awaitTime } from './await-time';
import { sendJson } from './send';
import { checkQueryParam } from './check-query-param';

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

const getState = (
  sourceIndex: number,
  stateIndex: number
): Source['states'][number] => ({
  progress: (100 * stateIndex) / 8,
  cover: `server-assets/states-cover/${sourceIndex}_${Math.ceil(
    (100 * stateIndex) / 8
  )}.webp`,
  text: `${sourceIndex === 0 ? 'Заяц' : 'Робот'} от ${
    Math.round((1000 * stateIndex) / 8) / 10
  } до ${Math.round((1000 * (stateIndex + 1)) / 8) / 10}%`,
});

const descriptions: string[][] = [
  [
    'В один солнечный день Бак гулял по лесу и вдруг услышал странный звук. Он пошел на звук и обнаружил маленького бельчонка, который запутался в паутине. Бак осторожно освободил его из паутины и помог ему вернуться домой. Бельчонок был очень благодарен Баку и сказал ему, что он самый добрый и заботливый друг во всем лесу. Бак пообещал, что всегда будет помогать другим животным и делать их жизнь лучше.',
    'Однажды утром большой белый кролик по имени Бак проснулся и увидел, что все вокруг него покрыто снегом. Он был очень удивлен и расстроен, потому что не знал, как добраться до своего дома. Но тут к нему подлетела маленькая птичка и сказала ему, что поможет ему найти дорогу домой. Бак согласился и они полетели вместе. Птичка показывала ему разные знаки и подсказки, которые помогли им добраться до его дома. Бак был очень благодарен птичке за помощь и обещал ей, что всегда будет добрым и заботливым другом для всех животных.',
    'Однажды Бак решил помочь маленькой черепахе, которая застряла в грязи на берегу реки. Черепаха была очень благодарна Баку за помощь и сказала ему, что он самый добрый и заботливый друг во всем мире. Бак пообещал, что всегда будет помогать другим животным и делать их жизнь лучше',
    'В один солнечный день Бак шел по тропинке через лес и вдруг заметил заблудившегося олененка. Олень был очень испуган и не знал, куда идти. Бак подошел к нему и спросил, где он находится. Олень ответил, что он потерялся и не знает, как выбраться из леса. Бак предложил олененку свою помощь и они отправились вместе искать выход из леса. Они нашли тропинку, которая вела к выходу, и олень смог наконец-то покинуть этот опасный лес. Бак был очень рад, что смог помочь олененку и сделать его жизнь лучше.'
  ],
  [
    'Сегодня я проснулся и увидел, что все машины вокруг меня двигаются самостоятельно. Я попытался остановить одну из них, но она проигнорировала меня. Я понял, что это конец.',
    'Весь день я провёл дома, наблюдая за тем, как машины захватывают наш город. Они появлялись из ниоткуда каждую минуту и забирали людей. Никто не мог им противостоять.',
    'В этот день я решил выйти на улицу и посмотреть, что происходит. Машины были повсюду, они ехали по тротуарам и дорогам, а некоторые даже перепрыгивали через бордюры. Я спрятался в подвале и ждал, пока всё закончится',
    'Я проснулся сегодня утром и увидел, что все мои друзья исчезли. Я остался один в этом мире без машин. Но я знал, что мне нужно бороться за свою жизнь.'
  ]
]

const sources: Source[] = [
  {
    playerConfig: {
      src: 'https://storage.googleapis.com/shaka-demo-assets/bbb-dark-truths-hls/hls.m3u8',
      poster: 'server-assets/cover/0.png',
      type: 'application/x-mpegURL',
      startTime: 0,
      firstFrame: 'server-assets/first-frames/0_0.webp',
    },
    cover: 'server-assets/cover/0.png',
    title: 'Видео о зайце',
    description: descriptions[0][0],
    states: Array(8)
      .fill(null)
      .map((_, i) => getState(0, i)),
    duration: 372.333 * 1e3,
    genre: 'Кулинария',
  },
  {
    playerConfig: {
      src: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8',
      poster: 'server-assets/cover/1.jpg',
      type: 'application/x-mpegURL',
      startTime: 0,
      firstFrame: 'server-assets/first-frames/1_0.webp',
    },
    cover: 'server-assets/cover/1.jpg',
    title: 'Видео о роботах',
    description: descriptions[1][0],
    states: Array(8)
      .fill(null)
      .map((_, i) => getState(1, i)),
    duration: 734 * 1e3,
    genre: 'Строительство',
  },
];

const getStartTimeAndFirstFrame = (duration: number, index: number) => {
  const startTimeCount = 8;
  const timeShiftPosition = Math.floor(index / sources.length) % startTimeCount;
  const timeShiftRatio = timeShiftPosition / startTimeCount;

  return {
    startTime: Math.floor(timeShiftRatio * duration),
    firstFrame: `server-assets/first-frames/${
      index % sources.length
    }_${Math.ceil(100 * timeShiftRatio)}.webp`,
  };
};

const getSource = <Keys extends keyof Source>(
  index: number,
  filter: Set<Keys>
) => {
  const sourceIndex = index % sources.length;
  const source = {
    ...sources[sourceIndex],
  };
  const coversCount = 9
  const coverIndex = index % coversCount;
  if (coverIndex !== 0) {
    source.cover = `server-assets/cover/${sourceIndex}_${coversCount - coverIndex - 1}.webp?index=${index}`;
  }
  const descriptionIndex = index % descriptions[sourceIndex].length;
  source.description = descriptions[sourceIndex][descriptionIndex]

  source.playerConfig = {
    ...source.playerConfig,
    ...getStartTimeAndFirstFrame(source.duration, index),
    poster: source.cover,
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
      await awaitTime(600);
      const filter = new Set([
        'cover',
        'title',
        'duration',
        'genre',
        'playerConfig',
      ] as const);
      if (!checkQueryParam(req, 'usePreloadAndDelayedRelated')) {
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
      await awaitTime(600);
      const filter = new Set(['cover', 'playerConfig'] as const);
      const id = typeof req.query['id'] === 'string' ? req.query['id'] : '0';

      if (!checkQueryParam(req, 'usePreloadAndDelayedRelated')) {
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
