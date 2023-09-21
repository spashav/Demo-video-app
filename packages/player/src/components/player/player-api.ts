import videojs from 'video.js';
import VideoJsPlayerApi from 'video.js/dist/types/player';
import {
  PlayerPlayingState,
  PlayerPublicApi,
  PlayerState,
} from '../../public-api';
import { eventEmitter } from '../../utils/event-emitter';

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

  private contentImpression = eventEmitter<{ isAutoplay: boolean }>();
  public onContentImpression = this.contentImpression.on;

  private apiReady = eventEmitter();
  public onApiReady = this.apiReady.on;

  private playerReady = eventEmitter();
  public onPlayerReady = this.playerReady.on;

  private playerState = eventEmitter<PlayerState>(PlayerState.NOT_INITED);
  public onPlayerStateChange = this.playerState.on;
  public getPlayerState = this.playerState.getLastEventParams;

  private playingState = eventEmitter<PlayerPlayingState>(
    PlayerPlayingState.NOT_STARTED,
  );
  public onPlayingStateChange = this.playingState.on;

  private duration = eventEmitter<{ time: number }>({ time: 0 });
  public onDurationChange = this.duration.on;

  private currentTime = eventEmitter<{ time: number }>({ time: 0 });
  public onCurrentTimeChange = this.currentTime.on;

  private error = eventEmitter<{ msg: string }>();
  public onError = this.error.on;

  private isContentImpressionEmitted = false;

  public setSource = (options: InitOptions, videoRef: HTMLDivElement) => {
    this.isContentImpressionEmitted = false;
    this.playerState.emit(PlayerState.INITIALIZING);
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
          this.playerReady.emit();
        }
      ));
      player.poster(options.sources[0].poster);
      player.on('timeupdate', () => {
        this.currentTime.emit({
          time: player.currentTime() || 0,
        });
      });
      player.on('durationchange', () => {
        this.duration.emit({
          time: player.duration() || 0,
        });
      });
      player.on('canplaythrough', () => {
        if (this.getPlayerState() !== PlayerState.INITED) {
          this.playerState.emit(PlayerState.INITED);
        }
      });
      player.on('error', () => {
        this.error.emit({ msg: 'Some player error' });
      });
      player.on('pause', () => {
        this.playingState.emit(PlayerPlayingState.PAUSE);
      });
      player.on('play', () => {
        this.playingState.emit(PlayerPlayingState.PLAY);
      });
      player.on('playing', () => {
        if (this.isContentImpressionEmitted) {
          return;
        }
        this.isContentImpressionEmitted = true;
        this.contentImpression.emit({ isAutoplay: true });
      });
      player.on('ended', () => {
        this.playingState.emit(PlayerPlayingState.ENDED);
      });
      this.apiReady.emit();
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
    this.playerState.emit(PlayerState.DESTROYED);
    const player = this.videoJsRef;
    if (player && !player.isDisposed()) {
      player.dispose();
      this.videoJsRef = null;
    }
  };
}
