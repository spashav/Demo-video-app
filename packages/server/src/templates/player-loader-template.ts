export const playerLoaderTemplate = (playerVersion: { get: () => string }) => `
  (() => {
    window.PLAYER = window.PLAYER || {};
    let promise
    window.PLAYER.loadResources = (props) => {
      const isIframe = !props.disableIframe;
      promise = promise || (isIframe ?
        loadScript('/player_iframe_v${playerVersion.get()}.js') :
        Promise.all([
          loadScript('/player_v${playerVersion.get()}.js'),
          loadStyles('/player_v${playerVersion.get()}.css'),
        ])
      );
      return promise
    }
    window.PLAYER.init = (props) => {
      const disableIframe = Boolean(props.disableIframe);
      return window.PLAYER.loadResources({ disableIframe }).then(() => {
        return disableIframe ? window.PLAYER.inner.init(props) : window.PLAYER.iframe.init(props);
      })
    }

    function loadStyles(url) {
      return new Promise((resolve, reject) => {
        const link = document.createElement('link')

        link.rel = 'stylesheet'
        link.type = 'text/css'
        link.href = url
        link.media = 'all'
        link.onload = resolve
        link.onerror = reject

        document.head.appendChild(link)
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
