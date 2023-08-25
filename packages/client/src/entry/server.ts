import * as path from 'path';
import * as express from 'express';
import * as cors from 'cors';

import { handleSsrRequest } from '../server/handle-ssr-request';
import { initApiRouter } from '../server/api-router';

const port = process.env['PORT'] || 4200;
const app = express();

const browserDist = path.join(process.cwd(), 'dist/packages/client/browser');
const indexPath = path.join(browserDist, 'index.html');

app.use(cors());

app.use('/api', [express.json(), initApiRouter()]);

app.get(
  '*.*',
  express.static(browserDist, {
    maxAge: '1y',
  })
);

app.use('*', handleSsrRequest(indexPath));

const server = app.listen(port, () => {
  // Server has started
});

server.on('error', console.error);
