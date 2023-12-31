import { Router } from 'express';
import { sendJson } from './send';

export const initPlayerVersionRouter = (playerVersion: {
  get: () => string;
  set: (version: string) => void;
}) => {
  const router = Router();

  router
    .get('/change-player-version/:version', async (req, res) => {
      const { version } = req.params;
      playerVersion.set(version);
      sendJson(res, { status: 'ok' });
    })
    .get('/get-player-version', async (req, res) => {
      sendJson(res, { version: playerVersion.get() });
    })
    .get('/get-player-resources', async (req, res) => {
      sendJson(res, {
        js: [
          `/player_v${playerVersion.get()}.js`
        ],
        css: [
          `/player_v${playerVersion.get()}.css`
        ]
      });
    });

  return router;
};
