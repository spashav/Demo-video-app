import * as ReactDOM from 'react-dom/client';

import { getPlayerPublicApi, PlayerState, VideoSource } from '../../public-api';
import { PlayerIframe, videoSourceProvider } from './player-iframe';
import { PlayerApiInnerIframe } from './player-iframe-api';

export const initPublicApi = ({ playerVersion }: { playerVersion: string }) => {
  const publicApi = getPlayerPublicApi();
  console.log(`Player init with version ${playerVersion}`);

  let playerApi: PlayerApiInnerIframe | undefined;

  publicApi.inner.init = async ({
    container,
    videoSource,
    id,
  }: {
    id: string;
    container: string;
    videoSource?: VideoSource;
  }) => {
    if (playerApi && playerApi.getPlayerState() === PlayerState.DESTROYED) {
      videoSourceProvider.clear()
      playerApi = undefined;
    }
    if (playerApi) {
      videoSourceProvider.emit({ id, source: videoSource });
      return playerApi;
    }
    // Тут тоже можно убрать iframe api
    playerApi = new PlayerApiInnerIframe();
    ReactDOM.createRoot(
      document.getElementById(container) as HTMLElement
    ).render(
      <PlayerIframe
        initialContentId={id}
        playerApi={playerApi}
        initialSource={videoSource}
      />
    );
    await new Promise<void>((resolve) => {
      playerApi.onApiReady(resolve, true);
    });
    return playerApi;
  };
};
