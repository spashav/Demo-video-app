import * as path from 'path';
import * as express from 'express';
import * as cors from 'cors';

import { App } from '@demo-video-app/client/src/components/app/app';
import { App as PlayerEmbed } from '@demo-video-app/player/src/components/app/app';
import { handleSsrRequest } from './utils/handle-ssr-request';
import { initApiRouter } from './utils/api-router';
import { appTemplate } from './templates/app-template';
import { playerEmbedTemplate } from './templates/player-embed-template';
import { initPlayerVersionRouter } from './utils/player-version-router';
import { send } from './utils/send';

const port = process.env['PORT'] || 4200;
const app = express();

const browserDist = path.join(process.cwd(), 'dist/packages/client/browser');

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
    body: `
    (() => {
      window.PLAYER = window.PLAYER || {};
      let promise
      window.PLAYER.init = (props) => {
        promise = promise || loadScript('/player_iframe_v${playerVersion.get()}.js');
        return promise.then(() => {
          return window.PLAYER.iframe.init(props);
        })
      }

      function loadScript(url) {
        return new Promise((resolve, reject) => {
          const script = document.createElement('script');

          script.src = url;
          script.defer = true;
          script.async = true;
          script.onload = resolve;
          script.onerror = reject;

          document.head.appendChild(script);
        })
      }
    })()
    `,
    res,
    type: 'application/javascript'
  });
});

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
