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
import { loadScript } from './load-script';

export interface PlayerLibState {
  currentTime: number;
  duration: number;
  playingState: PlayerPlayingState;
  playerState: PlayerState;
}

interface WindowWithHiddenStateAndScriptsPromise {
  isHiddenWhileLoad: boolean;
  playerScriptsPromise: Promise<void>;
}

const initialState: PlayerLibState = {
  currentTime: 0,
  duration: 0,
  playingState: PlayerPlayingState.NOT_STARTED,
  playerState: PlayerState.NOT_INITED,
};

export class PlayerLib {
  private state: PlayerLibState = initialState;
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

  public getInitialState = <StateKey extends keyof PlayerLibState>(
    key: StateKey
  ) => initialState[key];

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
    scripts,
    useFirstFrame,
    backgroundColor,
    disableLoader,
  }: {
    container: string;
    id: string;
    disableIframe: boolean;
    videoSource?: VideoSource;
    scripts?: string[];
    useFirstFrame?: boolean;
    backgroundColor?: string;
    disableLoader?: boolean;
  }) => {
    const win = window as unknown as WindowWithHiddenStateAndScriptsPromise;
    await win.playerScriptsPromise;
    const api = await getPlayerPublicApi().init({
      id,
      container,
      disableIframe,
      backgroundColor,
      disableLoader,
      videoSource: videoSource
        ? {
            ...videoSource,
            poster: useFirstFrame ? undefined : videoSource.poster,
          }
        : undefined,
    });
    this.api = api;

    this.playerApiUnsubscribeCallbacks.forEach((unsubscribe) => unsubscribe());
    this.playerApiUnsubscribeCallbacks = [
      api.onCurrentTimeChange(({ time }) => this.setState('currentTime', time)),
      api.onDurationChange(({ time }) => this.setState('duration', time)),
      api.onPlayingStateChange((playingState) =>
        this.setState('playingState', playingState)
      ),
      api.onPlayerStateChange((playerState) => {
        this.setState('playerState', playerState);
        if (
          playerState === PlayerState.INITED ||
          playerState === PlayerState.DESTROYED
        ) {
          this.loadScripts(scripts);
          scripts = [];
        }
      }),
      api.onError(({ msg }) => logError(msg)),
      api.onContentImpression(() => {
        const time = performance.now();
        const { time: startTime, isFirst } = pageLib.getCurrent();
        if (isFirst) {
          !win.isHiddenWhileLoad &&
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

  private loadScripts = (scripts: string[] = []) => {
    return Promise.all(scripts.map((script) => loadScript(script)));
  };
}
