export const appTemplate = () => `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Client</title>
    <base href="/" />

    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="icon" type="image/x-icon" href="favicon.ico" />
    <link rel="stylesheet" href="styles.css" />
    <link rel="stylesheet" href="main.css" />
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
    <script src="runtime.js" type="module"></script>
    <script src="styles.js" type="module"></script>
    <script src="vendor.js" type="module"></script>
    <script src="player_loader.js" type="module"></script>
    <script src="main.js" type="module"></script>
  </body>
</html>
`
