import { Player } from '../player/player';
import { useEffect, useState } from 'react';
import { PlayerApiInnerIframe } from './player-iframe-api';
import { eventEmitter } from '../../utils/event-emitter';

export const contentIdProvider = eventEmitter<string>();
export function PlayerIframe({
  initialContentId,
  playerApi,
}: {
  initialContentId: string;
  playerApi: PlayerApiInnerIframe;
}) {
  const [id, setId] = useState<string>(initialContentId);
  useEffect(() => {
    contentIdProvider.on(setId);
  }, []);

  useEffect(() => {
    return playerApi.initPostMessageListener();
  }, [playerApi]);

  if (!id) {
    return <div>Empty id or version in url</div>;
  }
  return <Player overridePlayerApi={playerApi} videoConfig={{ id }} />;
}
