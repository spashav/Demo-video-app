import * as ReactDOM from 'react-dom/client';

import { getPlayerPublicApi } from '../../public-api';
import { PlayerIframe } from './player-iframe';
import { PlayerApiInnerIframe } from './player-iframe-api';

export const initPublicApi = ({ playerVersion }: { playerVersion: string }) => {
  const publicApi = getPlayerPublicApi();
  console.log(`Player init with version ${playerVersion}`);

  publicApi.inner.init = async ({
    container,
    id,
  }: {
    id: string;
    container: string;
  }) => {
    const playerApi = new PlayerApiInnerIframe();
    ReactDOM.createRoot(
      document.getElementById(container) as HTMLElement
    ).render(<PlayerIframe id={id} playerApi={playerApi} />);
    await new Promise<void>((resolve) => {
      playerApi.onApiReady(resolve, true);
    });
    return playerApi;
  };
};
