import type { Request, Response } from 'express';
import * as ReactDOMServer from 'react-dom/server';

import { StaticRouter } from 'react-router-dom/server';
import { App } from '@demo-video-app/client/src/components/app/app';
import { FlagsContextProvider } from '@demo-video-app/client/src/utils/use-flags';
import { VideoSourceCacheContextProvider } from '@demo-video-app/client/src/utils/api-cache';
import { InitialClientState } from '@demo-video-app/client/src/types/initial-client-state';
import {
  START_SECOND_CHUNK,
  FINISH_SECOND_CHUNK,
} from '@demo-video-app/client/src/components/related/related';
import { RelatedSecondChunk } from '@demo-video-app/client/src/entry/related';
import { escapeHtmlEntities } from '@demo-video-app/server/src/utils/escape-html-entities';

export function handleSsrRequest(
  template: (req: Request) => Promise<{
    templateStr: string;
    appState: InitialClientState;
    getRelated?: () => Promise<any>;
  }>
) {
  return async function render(req: Request, res: Response) {
    const { templateStr, appState, getRelated } = await template(req);

    const [htmlStart, htmlEnd] = templateStr.split(`<div id="root"></div>`);

    const appStr = ReactDOMServer.renderToString(
      <StaticRouter location={req.originalUrl}>
        <FlagsContextProvider req={req}>
          <VideoSourceCacheContextProvider initialState={appState}>
            <App />
          </VideoSourceCacheContextProvider>
        </FlagsContextProvider>
      </StaticRouter>
    );
    res.statusCode = 200;
    res.setHeader('Content-type', 'text/html; charset=utf-8');
    res.write(`${htmlStart}<div id="root">`);
    const [firstChunk, rest] = appStr.split(START_SECOND_CHUNK);
    const [, thirdChunk] = (rest || '').split(FINISH_SECOND_CHUNK);
    if (!thirdChunk || !getRelated) {
      res.write(appStr);
    } else {
      res.write(firstChunk);
      const related = await getRelated();
      const appStateWithRelated = {
        ...appState,
        related,
      };
      const { id } = req.params;
      const relatedStr = ReactDOMServer.renderToString(
        <StaticRouter location={req.originalUrl}>
          <FlagsContextProvider req={req}>
            <VideoSourceCacheContextProvider initialState={appStateWithRelated}>
              <RelatedSecondChunk id={id} related={related} />
            </VideoSourceCacheContextProvider>
          </FlagsContextProvider>
        </StaticRouter>
      );
      const [, rest] = relatedStr.split(START_SECOND_CHUNK);
      const [secondChunk] = (rest || '').split(FINISH_SECOND_CHUNK);
      res.write(secondChunk);
      res.write(thirdChunk);
      res.write(`
        <script>
          window.APP_STATE = {
            ...window.APP_STATE,
            related: ${escapeHtmlEntities(JSON.stringify(related))}
          }
        </script>
      `);
    }
    res.write(`</div>${htmlEnd}`);
    res.end();
  };
}
