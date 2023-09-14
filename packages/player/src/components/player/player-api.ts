import videojs from 'video.js';
import VideoJsPlayerApi from 'video.js/dist/types/player';
import { PlayerPlayingState, PlayerPublicApi } from '../../public-api';

const eventEmitter = <Params extends Array<unknown> = []>() => {
  let callbacks: Array<(...params: Params) => void> = [];
  return {
    on: (cb: (typeof callbacks)[number]) => {
      callbacks.push(cb);
      return () => {
        callbacks = callbacks.filter((savedCb) => savedCb !== cb);
      };
    },
    emit: (...param: Params) => {
      [...callbacks].forEach((cb) => cb(...param));
    },
  };
};

export interface InitOptions {
  autoplay?: boolean | 'play' | 'muted' | 'any';
  sources: {
    src: string;
    type: string;
    poster: string;
  }[];
}

export class PlayerApi implements PlayerPublicApi {
  private videoJsRef: VideoJsPlayerApi | null = null;

  private contentImpression = eventEmitter<[{ isAutoplay: boolean }]>();
  public onContentImpression = this.contentImpression.on;

  private resourceIdle = eventEmitter();
  public onResourceIdle = this.resourceIdle.on;

  private apiReady = eventEmitter();
  public onApiReady = this.apiReady.on;

  private playingState = eventEmitter<[PlayerPlayingState]>();
  public onPlayingStateChange = this.playingState.on;

  private currentTime = eventEmitter<[{ time: number }]>();
  public onCurrentTimeChange = this.currentTime.on;

  private isContentImpressionEmitted = false

  public setSource = (options: InitOptions, videoRef: HTMLDivElement) => {
    this.isContentImpressionEmitted = false
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
          this.apiReady.emit();
        }
      ));
      player.poster(options.sources[0].poster);
      player.on('timeupdate', () => {
        this.currentTime.emit({
          time: player.currentTime() || 0,
        });
      });
      player.on('canplaythrough', () => {
        console.log('canplaythrough');
        this.resourceIdle.emit()
      });
      player.on('pause', () => {
        this.playingState.emit(PlayerPlayingState.PAUSE);
      });
      player.on('play', () => {
        this.playingState.emit(PlayerPlayingState.PLAY);
      });
      player.on('playing', () => {
        console.log('playing');
        if (this.isContentImpressionEmitted) {
          return
        }
        this.isContentImpressionEmitted = true
        this.contentImpression.emit({ isAutoplay: true })
      });
      player.on('waiting', () => {
        console.log('waiting');
      });
      player.on('ended', () => {
        this.playingState.emit(PlayerPlayingState.ENDED);
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
