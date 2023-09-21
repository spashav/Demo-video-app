import { VideoSource } from '@demo-video-app/player/src/public-api';

const initVideoSourceCache = () => {
  const cache: Record<string, VideoSource> = {};
  return {
    set: (id: string, videoSource: VideoSource) => (cache[id] = videoSource),
    get: (id: string): VideoSource | undefined => cache[id],
  };
};

export const videoSourceCache = initVideoSourceCache()
