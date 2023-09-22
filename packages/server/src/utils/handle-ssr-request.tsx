import type { Request, Response } from 'express';
import * as ReactDOMServer from 'react-dom/server';
import isbot from 'isbot';

import { StaticRouter } from 'react-router-dom/server';
import { ComponentType } from 'react';
import { FlagsContextProvider } from '@demo-video-app/client/src/utils/use-flags';

export function handleSsrRequest(
  template: (req: Request) => Promise<string>,
  Comp: ComponentType
) {
  return async function render(req: Request, res: Response) {
    let didError = false;
    const templateStr = await template(req)

    const [htmlStart, htmlEnd] = templateStr.split(`<div id="root"></div>`);

    // For bots (e.g. search engines), the content will not be streamed but render all at once.
    // For users, content should be streamed to the user as they are ready.
    const callbackName = isbot(req.headers['user-agent'])
      ? 'onAllReady'
      : 'onShellReady';

    const stream = ReactDOMServer.renderToPipeableStream(
      <StaticRouter location={req.originalUrl}>
        <FlagsContextProvider req={req}>
          <Comp />
        </FlagsContextProvider>
      </StaticRouter>,
      {
        [callbackName]() {
          res.statusCode = didError ? 500 : 200;
          res.setHeader('Content-type', 'text/html; charset=utf-8');
          res.write(`${htmlStart}<div id="root">`);
          stream.pipe(res);
          res.write(`</div>${htmlEnd}`);
        },
        onShellError(error) {
          console.error(error);
          res.statusCode = 500;
          res.send('<!doctype html><h1>Server Error</h1>');
        },
        onError(error) {
          didError = true;
          console.error(error);
        },
      }
    );
  };
}
