import * as path from 'path';
import * as express from 'express';
import * as cors from 'cors';

import { App } from '@demo-video-app/client/src/components/app/app';
import { getMainTemplate, getWatchTemplate } from './templates/app-template';
import { playerEmbedTemplate } from './templates/player-embed-template';
import { playerLoaderTemplate } from './templates/player-loader-template';
import { handleSsrRequest } from './utils/handle-ssr-request';
import { initApiRouter } from './utils/api-router';
import { initPlayerVersionRouter } from './utils/player-version-router';
import { send } from './utils/send';

const port = process.env['PORT'] || 4200;
const app = express();

const browserDist = path.join(process.cwd(), 'dist/packages/client/browser');
const faviconDist = path.join(
  process.cwd(),
  'dist/packages/client/browser/client/src/assets/favicon.ico'
);
const serverAssetsDist = path.join(
  process.cwd(),
  'dist/packages/client/server/server/src'
);

app.use(cors());

const playerVersion = {
  version: '1',
  get: () => playerVersion.version,
  set: (version: string) => (playerVersion.version = version),
};

app.use('/api', [express.json(), initApiRouter()]);
app.use('/release', [express.json(), initPlayerVersionRouter(playerVersion)]);
app.use('/player_loader.js', (req, res) => {
  send({
    body: playerLoaderTemplate(playerVersion),
    res,
    type: 'application/javascript',
  });
});

app.get(
  'favicon.ico',
  express.static(faviconDist, {
    maxAge: '1y',
  })
);

app.get(
  '/server-assets/*',
  express.static(serverAssetsDist, {
    fallthrough: false,
    maxAge: '1y',
  })
);
app.get(
  '*.*',
  express.static(browserDist, {
    maxAge: '1y',
  })
);

app.use('/player/*', (req, res) => {
  send({
    res,
    body: playerEmbedTemplate(req),
  });
});
app.use('/watch/:id', handleSsrRequest(getWatchTemplate, App));
app.use('*', handleSsrRequest(getMainTemplate, App));

const server = app.listen(port, () => {
  // Server has started
});

server.on('error', console.error);
