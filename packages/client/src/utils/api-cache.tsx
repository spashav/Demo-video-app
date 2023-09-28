import { createContext, FC, ReactNode, useContext, useState } from 'react';
import { VideoSource } from '@demo-video-app/player/src/public-api';
import { InitialClientState } from '../types/initial-client-state';

interface CacheLib {
  set: (id: string, videoSource: VideoSource) => undefined;
  get: (id: string) => VideoSource | undefined;
}
const initVideoSourceCache = (): CacheLib => {
  const cache: Record<string, VideoSource> = {};

  return {
    set: (id: string, videoSource: VideoSource) => {
      cache[id] = videoSource;
    },
    get: (id: string): VideoSource | undefined => cache[id],
  };
};

const defaultVideoSourceCache: CacheLib = {
  set: () => undefined,
  get: () => undefined,
};

const videoSourceCacheContext = createContext<CacheLib>(
  defaultVideoSourceCache
);

const VideoSourceCacheContextProviderInner = videoSourceCacheContext.Provider;
export const VideoSourceCacheContextProvider: FC<{
  initialState: InitialClientState;
  children: ReactNode;
}> = ({ children, initialState }) => {
  const [videoSourceCache] = useState(() => {
    const videoSourceCache = initVideoSourceCache();
    const initialSource = initialState.videoSource;
    if (initialSource) {
      videoSourceCache.set(initialSource.id, initialSource);
    }
    return videoSourceCache;
  });
  return (
    <VideoSourceCacheContextProviderInner value={videoSourceCache}>
      {children}
    </VideoSourceCacheContextProviderInner>
  );
};

export const useVideoSourceCache = () => {
  return useContext(videoSourceCacheContext);
};
