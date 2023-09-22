import { Request } from 'express';
import fetch from 'node-fetch';

export const appTemplate = async (req: Request) => {
  let playerResources: { js: string[]; css: string[] } | undefined;
  const apiBaseUrl = `http://${req.header('host')}`
  if (req.query['useDelayedApp']) {
    const res = await fetch(`${apiBaseUrl}/release/get-player-resources`);
    playerResources = await res.json() as typeof playerResources
  }

  const scripts = [
    'runtime.js',
    'styles.js',
    'vendor.js',
    ...(playerResources?.js || ['player_loader.js']),
    'main.js',
  ];
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
    <div id="root"></div>
    ${scripts
      .map((script) => `<script src="${script}" type="module"></script>`)
      .join('\n')}
  </body>
</html>
`;
};
