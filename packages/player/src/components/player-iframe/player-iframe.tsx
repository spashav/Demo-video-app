import { Player } from '../player/player';
import { useEffect } from 'react';
import { PlayerApiInnerIframe } from './player-iframe-api';

export function PlayerIframe({
  id,
  playerApi,
}: {
  id: string;
  playerApi: PlayerApiInnerIframe;
}) {
  useEffect(() => {
    return playerApi.initPostMessageListener();
  }, [playerApi]);

  if (!id) {
    return <div>Empty id or version in url</div>;
  }
  return <Player overridePlayerApi={playerApi} videoConfig={{ id }} />;
}
