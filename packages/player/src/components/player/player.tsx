import { FC, useEffect, useRef, useState } from 'react';

import '../../../../../node_modules/video.js/dist/video-js.css';
import { PlayerApi } from './player-api';

interface InitOptions {
  autoplay?: boolean;
  sources: {
    src: string;
    type: string;
    poster: string;
  }[];
}

export const Player: FC<{
  options: InitOptions;
  overridePlayerApi?: PlayerApi;
}> = (props) => {
  const { options, overridePlayerApi } = props;
  const videoRef = useRef<HTMLDivElement>(null);
  const [player] = useState(() => overridePlayerApi || new PlayerApi());

  useEffect(() => {
    if (!videoRef.current) {
      return;
    }
    player.setSource(options, videoRef.current);
  }, [options, videoRef]);

  useEffect(() => {
    return () => {
      player.destroy();
    };
  }, [player]);

  return <div style={{ width: '100%', height: '100%' }} ref={videoRef} />;
};
