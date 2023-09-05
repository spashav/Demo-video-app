import * as path from 'path';
import * as express from 'express';
import * as cors from 'cors';

import { handleSsrRequest } from '../server/handle-ssr-request';
import { initApiRouter } from '../server/api-router';
import { appTemplate } from '../server/app-template';
import { playerEmbedTemplate } from '../server/player-embed-template';
import { App } from '../components/app/app';
import { App as PlayerEmbed } from '@demo-video-app/player/src/components/app/app';

const port = process.env['PORT'] || 4200;
const app = express();

const browserDist = path.join(process.cwd(), 'dist/packages/client/browser');

app.use(cors());

app.use('/api', [express.json(), initApiRouter()]);

app.get(
  '*.*',
  express.static(browserDist, {
    maxAge: '1y',
  })
);

app.use('/player/*', handleSsrRequest(playerEmbedTemplate, PlayerEmbed));
app.use('*', handleSsrRequest(appTemplate, App));

const server = app.listen(port, () => {
  // Server has started
});

server.on('error', console.error);
