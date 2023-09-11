import videojs from 'video.js';
import VideoJsPlayerApi from 'video.js/dist/types/player';
import { PlayerPlayingState, PlayerPublicApi } from '../../public-api';

const eventEmitter = <Params extends Array<unknown> = []>() => {
  let callbacks: Array<(...params: Params) => void> = [];
  return {
    on: (cb: (typeof callbacks)[number]) => {
      callbacks.push(cb);
      return () => {
        callbacks = callbacks.filter(savedCb => savedCb !== cb);
      }
    },
    emit: (...param: Params) => {
      [...callbacks].forEach((cb) => cb(...param));
    },
  };
};

interface InitOptions {
  autoplay?: boolean;
  sources: {
    src: string;
    type: string;
    poster: string;
  }[];
}

export class PlayerApi implements PlayerPublicApi {
  private videoJsRef: VideoJsPlayerApi | null = null;

  private apiReady = eventEmitter();
  public onApiReady = this.apiReady.on;
  protected handleApiReady = this.apiReady.emit;

  private playingState = eventEmitter<[PlayerPlayingState]>();
  public onPlayingStateChange = this.playingState.on;
  private handlePlayingStateChange = this.playingState.emit;

  private currentTime = eventEmitter<[{ time: number }]>();
  public onCurrentTimeChange = this.currentTime.on;
  private handleCurrentTimeChange = this.currentTime.emit;

  public setSource = (options: InitOptions, videoRef: HTMLDivElement) => {
    if (!this.videoJsRef) {
      const videoElement = document.createElement('video-js');
      videoElement.style.height = '100%';
      videoElement.style.width = '100%';

      videoElement.classList.add('vjs-big-play-centered');
      videoRef.appendChild(videoElement);

      const player = (this.videoJsRef = videojs(
        videoElement,
        {
          controls: true,
          ...options,
        },
        () => {
          videojs.log('player is ready');
          this.handleApiReady();
        }
      ));
      player.poster(options.sources[0].poster);
      player.on('timeupdate', () => {
        this.handleCurrentTimeChange({
          time: player.currentTime() || 0,
        });
      });
    } else {
      const player = this.videoJsRef;

      player.autoplay(options.autoplay);
      player.src(options.sources);
    }
  };

  public play() {
    return undefined;
  }
  public pause() {}

  public destroy = () => {
    const player = this.videoJsRef;
    if (player && !player.isDisposed()) {
      player.dispose();
      this.videoJsRef = null;
    }
  };
}
