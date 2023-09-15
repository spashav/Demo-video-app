export const playerLoaderTemplate = (playerVersion: { get: () => string }) => `
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
`;
