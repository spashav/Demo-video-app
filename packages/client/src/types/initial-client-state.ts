import { VideoSource } from '@demo-video-app/player/src/public-api';

export interface InitialClientState {
  videoSource?: VideoSource;
  playerScripts?: string[];
  related?: {
    id: string;
    cover: string;
    playerConfig?: VideoSource;
  }[];
}
