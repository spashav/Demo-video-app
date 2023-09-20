export type SubscriptionsMethods =
  | 'onApiReady'
  | 'onDurationChange'
  | 'onContentImpression'
  | 'onResourceIdle'
  | 'onPlayingStateChange'
  | 'onCurrentTimeChange'
  | 'onError';
const settersMethods = ['play', 'pause', 'destroy'] as const;
export type SettersMethods = (typeof settersMethods)[number];
export type PlayerApiMethods = SubscriptionsMethods | SettersMethods;

export enum PlayerPlayingState {
  PAUSE = 'Pause',
  PLAY = 'Play',
  NOT_STARTED = 'Not_started',
  ENDED = 'Ended',
}

export enum PlayerState {
  NOT_INITED = 'NOT_INITED',
  INITIALIZING = 'INITIALIZING',
  INITED = 'INITED',
  DESTROYED = 'DESTROYED',
}

export const isSettersMethod = (
  method: PlayerApiMethods
): method is SettersMethods => {
  return settersMethods.includes(method as SettersMethods);
};

type Unsubscribe = () => void;

export interface PlayerPublicApi {
  // setters
  play: () => void;
  pause: () => void;
  destroy: () => void;
  // subscriptions
  onContentImpression: (
    cb: (props: { isAutoplay: boolean }) => void
  ) => Unsubscribe;
  onResourceIdle: (cb: () => void) => Unsubscribe;
  onApiReady: (cb: () => void) => Unsubscribe;
  onPlayingStateChange: (
    cb: (state: PlayerPlayingState) => void
  ) => Unsubscribe;
  onCurrentTimeChange: (cb: (state: { time: number }) => void) => Unsubscribe;
  onDurationChange: (cb: (state: { time: number }) => void) => Unsubscribe;
  onError: (cb: (state: { msg: string }) => void) => Unsubscribe;
}

export type PlayerIframeApi = {
  [Method in keyof PlayerPublicApi]: Method extends SubscriptionsMethods
    ? PlayerPublicApi[Method]
    : (
        ...data: Parameters<PlayerPublicApi[Method]>
      ) => Promise<ReturnType<PlayerPublicApi[Method]>>;
};

type InitPlayer<Api extends PlayerIframeApi | PlayerPublicApi> = (props: {
  id: string;
  container: string;
  disableIframe?: boolean;
}) => Promise<Api>;

interface WindowWithPlayer {
  PLAYER: {
    init: InitPlayer<PlayerIframeApi>;
    inner: {
      init: InitPlayer<PlayerPublicApi>;
    };
    iframe: {
      init: InitPlayer<PlayerIframeApi>;
    };
  };
}
export const getPlayerPublicApi = () => {
  const windowWithPublicApi = window as unknown as WindowWithPlayer;
  windowWithPublicApi.PLAYER = windowWithPublicApi.PLAYER || {};
  windowWithPublicApi.PLAYER.iframe = windowWithPublicApi.PLAYER.iframe || {};
  windowWithPublicApi.PLAYER.inner = windowWithPublicApi.PLAYER.inner || {};

  return windowWithPublicApi.PLAYER;
};
