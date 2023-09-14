import { FC, useEffect, useMemo, useRef, useState } from 'react';

import '../../../../../node_modules/video.js/dist/video-js.css';
import { PlayerApi, InitOptions } from './player-api';

interface VideoConfig {
  autoplay?: boolean;
  id: string;
  source?: {
    src: string;
    type: string;
    poster: string;
    id: string
  };
}

export const Player: FC<{
  videoConfig: VideoConfig;
  overridePlayerApi?: PlayerApi;
}> = props => {
  const { videoConfig, overridePlayerApi } = props;
  const videoRef = useRef<HTMLDivElement>(null);
  const [player] = useState(() => overridePlayerApi || new PlayerApi());

  const [source, setSource] = useState<VideoConfig['source']>(videoConfig.source);

  useEffect(() => {
    if (source && source.id === videoConfig.id) {
      return
    }
    const fetchConfig = async () => {
      const res = await fetch(`/api/player_config/${videoConfig.id}`);
      const config = await res.json();
      setSource(config);
    };
    fetchConfig();
  }, [source, videoConfig.id]);

  const initOptions = useMemo<InitOptions>(
    () => ({
      sources: source ? [source] : [],
      autoplay: 'any',
    }),
    [source]
  );

  useEffect(() => {
    if (!videoRef.current || !initOptions.sources.length) {
      return;
    }
    player.setSource(initOptions, videoRef.current);
  }, [initOptions, videoRef]);

  useEffect(() => {
    return () => {
      player.destroy();
    };
  }, [player]);

  return <div style={{ width: '100%', height: '100%' }} ref={videoRef} />;
};
