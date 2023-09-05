export const playerEmbedTemplate = () => `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Client</title>
    <base href="/" />

    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="icon" type="image/x-icon" href="favicon.ico" />
    <link rel="stylesheet" href="player.css" />
  </head>
  <body>
    <div id="root"></div>
    <script src="runtime.js" type="module"></script>
    <script src="vendor.js" type="module"></script>
    <script src="loader.js" type="module"></script>
    <script src="player.js" type="module"></script>
  </body>
</html>
`
