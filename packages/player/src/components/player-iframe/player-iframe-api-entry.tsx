import * as ReactDOM from 'react-dom/client';

import {getPlayerPublicApi, PlayerState} from '../../public-api';
import { PlayerIframe, contentIdProvider } from './player-iframe';
import { PlayerApiInnerIframe } from './player-iframe-api';

export const initPublicApi = ({ playerVersion }: { playerVersion: string }) => {
  const publicApi = getPlayerPublicApi();
  console.log(`Player init with version ${playerVersion}`);

  let playerApi: PlayerApiInnerIframe | undefined;

  publicApi.inner.init = async ({
    container,
    id,
  }: {
    id: string;
    container: string;
  }) => {
    if (playerApi && playerApi.getPlayerState() === PlayerState.DESTROYED) {
      playerApi = undefined
    }
    if (playerApi) {
      contentIdProvider.emit(id);
      return playerApi;
    }
    // Тут тоже можно убрать iframe api
    playerApi = new PlayerApiInnerIframe();
    ReactDOM.createRoot(
      document.getElementById(container) as HTMLElement
    ).render(<PlayerIframe initialContentId={id} playerApi={playerApi} />);
    await new Promise<void>((resolve) => {
      playerApi.onApiReady(resolve, true);
    });
    return playerApi;
  };
};
