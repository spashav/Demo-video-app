import { Player } from '../player/player';
import { useEffect, useState } from 'react';
import { PlayerApiInnerIframe } from './player-iframe-api';
import { eventEmitter } from '../../utils/event-emitter';
import { VideoSource } from '../../public-api';

export const videoSourceProvider = eventEmitter<{
  source?: VideoSource;
  id: string;
}>();

export function PlayerIframe({
  initialContentId,
  initialSource,
  playerApi,
  backgroundColor,
  disableLoader,
}: {
  initialContentId: string;
  initialSource?: VideoSource;
  playerApi: PlayerApiInnerIframe;
  backgroundColor?: string;
  disableLoader?: boolean;
}) {
  const [id, setId] = useState<string>(initialContentId);
  const [source, setSource] = useState<VideoSource | undefined>(initialSource);

  useEffect(() => {
    return videoSourceProvider.on(({ id, source }) => {
      setId(id);
      setSource(source);
    });
  }, []);

  useEffect(() => {
    return playerApi.initPostMessageListener();
  }, [playerApi]);

  if (!id) {
    return <div>Empty id or version in url</div>;
  }
  return (
    <Player
      overridePlayerApi={playerApi}
      videoConfig={{ id, source, backgroundColor, disableLoader }}
    />
  );
}
