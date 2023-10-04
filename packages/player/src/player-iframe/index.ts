import { getPlayerPublicApi } from '../public-api';
import { PlayerIframeApiAdapter } from '@demo-video-app/player/src/player-iframe/player-iframe-api-adapter';

export const initPublicApi = ({ playerVersion }: { playerVersion: string }) => {
  const api = getPlayerPublicApi();
  let unsubscribeFromPrevIframe: () => void;
  api.iframe.init = async ({
    id,
    container,
    backgroundColor,
    disableLoader,
  }: {
    id: string;
    container: string;
    disableLoader?: boolean;
    backgroundColor?: string;
  }) => {
    const elem = document.getElementById(container);
    if (!id) {
      throw new Error(`Empty id`);
    }
    if (!elem) {
      throw new Error(`No container found`);
    }
    unsubscribeFromPrevIframe?.();
    const { width, height } = elem.getBoundingClientRect();
    elem.innerHTML = `<iframe src="/player/v${playerVersion}/${id}?disableLoader=${disableLoader}&backgroundColor=${
      backgroundColor || ''
    }" width="${width}px" height="${height}px" style="box-sizing:border-box;border:0;border-radius:24px;"/>`;
    const iframe = elem.querySelector('iframe');
    const iframeWindow = iframe?.contentWindow;
    if (!iframeWindow) {
      throw new Error(`Failed get iframe content window`);
    }

    const api = new PlayerIframeApiAdapter(iframeWindow);
    await new Promise<void>((resolve) => {
      unsubscribeFromPrevIframe = api.initPostMessageListener(resolve);
    });
    return api;
  };
};
