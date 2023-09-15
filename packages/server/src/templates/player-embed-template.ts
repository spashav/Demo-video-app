import { Request } from 'express';

export const playerEmbedTemplate = (req: Request) => {
  const match = /^\/player\/v(\d+)\/(\d+)$/.exec(req.originalUrl)
  if (!match) {
    return 'Empty'
  }
  const playerVersion = `v${match[1]}`
  const contentId = match[2]
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <title>Client</title>
        <base href="/" />

        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/x-icon" href="favicon.ico" />
        <link rel="stylesheet" href="player_${playerVersion}.css" />
        <style>
          html,body {
            padding: 0;
            margin: 0;
            overflow: hidden;
          }
          #root {
            width: 100%;
            height: 100vh;
          }
        </style>
      </head>
      <body>
        <div id="root"></div>
        <script src="runtime.js"></script>
        <script src="vendor.js"></script>
        <script src="player_${playerVersion}.js"></script>
        <script>
          window.PLAYER.inner.init({
            container: 'root',
            id: "${contentId}"
          })
        </script>
      </body>
    </html>
  `;
};
