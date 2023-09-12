import { useParams } from 'react-router-dom';
import { Player } from '../player/player';
import { useEffect, useState, useMemo } from 'react';
import { PlayerApiInnerIframe } from './player-iframe-api';

export function PlayerIframe() {
  const { id, version } = useParams();

  const [player] = useState(() => new PlayerApiInnerIframe());
  useEffect(() => {
    return player.initPostMessageListener();
  }, []);

  if (!id || !version) {
    return <div>Empty id or version in url</div>;
  }
  return <Player overridePlayerApi={player} videoConfig={{ id }} />;
}
