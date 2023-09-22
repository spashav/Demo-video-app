import { VideoSource } from '@demo-video-app/player/src/public-api';
import { getInitialClientState } from './get-initial-client-state';

const initVideoSourceCache = () => {
  const cache: Record<string, VideoSource> = {};

  const cacheLib = {
    set: (id: string, videoSource: VideoSource) => (cache[id] = videoSource),
    get: (id: string): VideoSource | undefined => cache[id],
  };
  const state = getInitialClientState();
  const initialSource = state.videoSource;
  if (initialSource) {
    cacheLib.set(initialSource.id, initialSource);
  }
  return cacheLib;
};

export const videoSourceCache = initVideoSourceCache();
