import { Request } from 'express';
import fetch from 'node-fetch';
import { InitialClientState } from '@demo-video-app/client/src/types/initial-client-state';
import { escapeHtmlEntities } from '../utils/escape-html-entities';
import { checkQueryParam } from '../utils/check-query-param';

export const getWatchTemplate = async (req: Request) => {
  if (!checkQueryParam(req, 'useDelayedApp')) {
    return getCommonTemplate(req);
  }
  const apiBaseUrl = `http://${req.header('host')}`;
  const { id } = req.params;
  const videoSourceRes = await fetch(`${apiBaseUrl}/api/player_config/${id}`);
  const queryStr = Object.entries({
    id,
    ...req.query,
  })
    .map(([key, value]) => `${key}=${value}`)
    .join('&');

  const getRelated = () =>
    fetch(`${apiBaseUrl}/api/related?${queryStr}`)
      .then((res) => res.json())
      // Уменьшаем кол-во отрисовываемых карточек во втором чанке
      .then((res) => (res as Array<any>).slice(0, 9));
  const videoSource =
    (await videoSourceRes.json()) as InitialClientState['videoSource'];

  return getCommonTemplate(req, { videoSource }, getRelated);
};
export const getMainTemplate = async (req: Request) => {
  return getCommonTemplate(req);
};

const getCommonTemplate = async (
  req: Request,
  appState: InitialClientState = {},
  getRelated?: () => Promise<any>
) => {
  let playerResources: { js: string[]; css: string[] } | undefined;
  const apiBaseUrl = `http://${req.header('host')}`;
  const isDelayedApp = checkQueryParam(req, 'useDelayedApp');
  const isPlayerInlineInit = Boolean(isDelayedApp && appState.videoSource);
  if (isDelayedApp) {
    const playerResourcesRes = await fetch(
      `${apiBaseUrl}/release/get-player-resources`
    );
    playerResources =
      (await playerResourcesRes.json()) as typeof playerResources;
  }

  const inlineScripts = ['runtime.js', 'inline_lib.js'];

  const scripts: string[] = ['styles.js', 'vendor.js', 'main.js'];
  const styles = [
    'vendor.css',
    'styles.css',
    'main.css',
    ...(playerResources?.css || []),
  ];

  const appStateWithPlayerScripts = {
    ...appState,
    playerScripts: isPlayerInlineInit ? scripts : [],
  };

  const templateStr = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Client</title>
    <base href="/" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="icon" type="image/x-icon" href="favicon.ico" />
    <script>
    (() => {
      function loadScript(url) {
        return new Promise((resolve, reject) => {
          const script = document.createElement('script');

          script.src = url;
          script.async = true;
          script.onload = resolve;
          script.onerror = reject;

          document.head.appendChild(script);
        })
      }
      const scripts = [${(playerResources?.js || ['player_loader.js'])
        .map((s) => `"${s}"`)
        .join(', ')}];
      window.playerScriptsPromise = Promise.all(scripts.map(loadScript))
    })()
    </script>
    ${styles
      .map((style) => `<link rel="stylesheet" href="${style}" />`)
      .join('\n')}
   ${inlineScripts
     .map((script) => `<script src="${script}"></script>`)
     .join('\n')}

    <!-- Yandex.Metrika counter -->
    <script type="text/javascript" >
       (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
       m[i].l=1*new Date();
       for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
       k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
       (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

       ym(95401615, "init", {
            clickmap:true,
            trackLinks:true,
            accurateTrackBounce:true
       });
    </script>
    <noscript><div><img src="https://mc.yandex.ru/watch/95401615" style="position:absolute; left:-9999px;" alt="" /></div></noscript>
    <!-- /Yandex.Metrika counter -->
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
        JSON.stringify(appStateWithPlayerScripts)
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
  return {
    templateStr,
    appState: appStateWithPlayerScripts,
    getRelated,
  };
};
