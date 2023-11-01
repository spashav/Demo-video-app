import '../../../../../node_modules/video.js/dist/video-js.css';
import './player.css';

import { FC, useEffect, useMemo, useRef, useState, useReducer } from 'react';

import { PlayerApi, InitOptions } from './player-api';
import { VideoSource } from '../../public-api';

interface VideoConfig {
  autoplay?: boolean;
  id: string;
  source?: VideoSource;
  backgroundColor?: string;
  disableLoader?: boolean;
}

export const Player: FC<{
  videoConfig: VideoConfig;
  overridePlayerApi?: PlayerApi;
}> = (props) => {
  const { videoConfig, overridePlayerApi } = props;
  const videoRef = useRef<HTMLDivElement>(null);
  const prevId = useRef<string>();
  const [, forceUpdate] = useReducer(x => x + 1, 0)
  const isLongLoadingRef = useRef(false);
  if (prevId.current !== videoConfig.id) {
    isLongLoadingRef.current = false;
  }
  useEffect(() => {
    prevId.current = videoConfig.id;
    const timer = setTimeout(() => {
      isLongLoadingRef.current = true;
      forceUpdate();
    }, 1000);
    return () => {
      clearTimeout(timer);
    };
  }, [videoConfig.id]);
  const [player] = useState(() => overridePlayerApi || new PlayerApi());

  const [source, setSource] = useState<VideoSource>(videoConfig.source);

  useEffect(() => {
    if (source && source.id === videoConfig.id) {
      return;
    }
    if (videoConfig?.source?.id === videoConfig.id) {
      return setSource(videoConfig.source);
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
      backgroundColor: videoConfig.backgroundColor,
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

  return (
    <div
      style={{ width: '100%', height: '100%', borderRadius: 24 }}
      className={
        videoConfig.disableLoader && !isLongLoadingRef.current
          ? 'video-player_disabled-loader'
          : ''
      }
      ref={videoRef}
    />
  );
};
