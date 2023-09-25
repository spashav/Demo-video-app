import { Request } from 'express';
import fetch from 'node-fetch';
import { InitialClientState } from '@demo-video-app/client/src/types/initial-client-state';
import { escapeHtmlEntities } from '../utils/escape-html-entities';

export const getWatchTemplate = async (req: Request) => {
  if (!req.query['useDelayedApp']) {
    return getCommonTemplate(req);
  }
  const apiBaseUrl = `http://${req.header('host')}`;
  const { id } = req.params;
  const videoSourceRes = await fetch(`${apiBaseUrl}/api/player_config/${id}`);
  const videoSource =
    (await videoSourceRes.json()) as InitialClientState['videoSource'];
  return getCommonTemplate(req, { videoSource });
};
export const getMainTemplate = async (req: Request) => {
  return getCommonTemplate(req);
};

const getCommonTemplate = async (
  req: Request,
  appState: InitialClientState = {}
) => {
  let playerResources: { js: string[]; css: string[] } | undefined;
  const apiBaseUrl = `http://${req.header('host')}`;
  const isDelayedApp = req.query['useDelayedApp'];
  const isPlayerInlineInit = Boolean(isDelayedApp && appState.videoSource);
  if (isDelayedApp) {
    const playerResourcesRes = await fetch(
      `${apiBaseUrl}/release/get-player-resources`
    );
    playerResources =
      (await playerResourcesRes.json()) as typeof playerResources;
  }

  const inlineScripts = [
    'runtime.js',
    ...(playerResources?.js || ['player_loader.js']),
    'inline_lib.js',
  ];

  const scripts: string[] = ['styles.js', 'vendor.js', 'main.js'];
  const styles = [
    'vendor.css',
    'styles.css',
    'main.css',
    ...(playerResources?.css || []),
  ];

  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Client</title>
    <base href="/" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="icon" type="image/x-icon" href="favicon.ico" />
    ${styles
      .map((style) => `<link rel="stylesheet" href="${style}" />`)
      .join('\n')}
   ${inlineScripts
     .map((script) => `<script src="${script}"></script>`)
     .join('\n')}
  </head>
  <body>
    <script>
    (() => {
      const onVisibilityChange = () => {
         const visibilityState = document.visibilityState
         if (visibilityState === 'hidden') {
           document.removeEventListener('visibilitychange', onVisibilityChange)
           window.isHiddenWhileLoad = true
         }
      }
      window.isHiddenWhileLoad = false
      document.addEventListener('visibilitychange', onVisibilityChange)
      onVisibilityChange()
    })()
    </script>
    <script>
      window.APP_STATE = ${escapeHtmlEntities(
        JSON.stringify({
          ...appState,
          playerScripts: isPlayerInlineInit ? scripts : [],
        })
      )}
    </script>

    <div id="root"></div>
    ${
      isPlayerInlineInit
        ? ''
        : scripts
            .map((script) => `<script src="${script}"></script>`)
            .join('\n')
    }
  </body>
</html>
`;
};
