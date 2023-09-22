import {
  getPlayerPublicApi,
  PlayerIframeApi,
  PlayerPlayingState,
  PlayerState,
  VideoSource,
} from '@demo-video-app/player/src/public-api';
import { logError } from './log-error';
import { pageLib } from './pages';
import { logMetric } from './log-metric';

export interface PlayerLibState {
  currentTime: number;
  duration: number;
  playingState: PlayerPlayingState;
  playerState: PlayerState;
}

interface WindowWithHiddenState {
  isHiddenWhileLoad: boolean;
}

export class PlayerLib {
  private state: PlayerLibState = {
    currentTime: 0,
    duration: 0,
    playingState: PlayerPlayingState.NOT_STARTED,
    playerState: PlayerState.NOT_INITED,
  };
  private api?: PlayerIframeApi;
  private playerApiUnsubscribeCallbacks: Array<() => void> = [];
  private stateChangeSubscriptions: Partial<{
    [StateKey in keyof PlayerLibState]: Array<
      (state: PlayerLibState[StateKey]) => void
    >;
  }> = {};

  private setState = <StateKey extends keyof PlayerLibState>(
    key: StateKey,
    state: PlayerLibState[StateKey]
  ) => {
    this.state = {
      ...this.state,
      [key]: state,
    };
    const callbacks = this.stateChangeSubscriptions[key];
    if (callbacks) {
      [...callbacks].forEach((cb) => cb(state));
    }
  };

  public getState = <StateKey extends keyof PlayerLibState>(key: StateKey) =>
    this.state[key];

  public subscribeOnStateChange = <StateKey extends keyof PlayerLibState>(
    key: StateKey,
    cb: (state: PlayerLibState[StateKey]) => void
  ) => {
    const { stateChangeSubscriptions } = this;
    if (!stateChangeSubscriptions[key]) {
      stateChangeSubscriptions[key] = [];
    }
    stateChangeSubscriptions[key]!.push(cb);
    return () => {
      stateChangeSubscriptions[key] = stateChangeSubscriptions[key]!.filter(
        (innerCb) => innerCb !== cb
      ) as any;
    };
  };

  public init = async ({
    container,
    disableIframe,
    id,
    videoSource,
  }: {
    container: string;
    id: string;
    disableIframe: boolean;
    videoSource?: VideoSource;
  }) => {
    const api = await getPlayerPublicApi().init({
      id,
      container,
      disableIframe,
      videoSource,
    });
    this.api = api;

    this.playerApiUnsubscribeCallbacks.forEach((unsubscribe) => unsubscribe());
    this.playerApiUnsubscribeCallbacks = [
      api.onCurrentTimeChange(({ time }) => this.setState('currentTime', time)),
      api.onDurationChange(({ time }) => this.setState('duration', time)),
      api.onPlayingStateChange((playingState) =>
        this.setState('playingState', playingState)
      ),
      api.onPlayerStateChange((playerState) =>
        this.setState('playerState', playerState)
      ),
      api.onError(({ msg }) => logError(msg)),
      api.onContentImpression(() => {
        const windowWithHiddenState =
          window as unknown as WindowWithHiddenState;
        const time = performance.now();
        const { time: startTime, isFirst } = pageLib.getCurrent();
        if (isFirst) {
          !windowWithHiddenState.isHiddenWhileLoad &&
            logMetric('First start', time);
        } else {
          logMetric('Spa start', time - startTime);
        }
      }),
    ];
  };

  public destroy = () => {
    this.api?.destroy();
    this.stateChangeSubscriptions = {};
  };

  public preloadResources = ({ disableIframe }: { disableIframe: boolean }) => {
    getPlayerPublicApi().loadResources?.({
      disableIframe,
    });
  };
}
