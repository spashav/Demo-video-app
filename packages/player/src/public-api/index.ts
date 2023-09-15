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

export const isSettersMethod = (
  method: PlayerApiMethods
): method is SettersMethods => {
  return settersMethods.includes(method as SettersMethods);
};

export interface PlayerPublicApi {
  // setters
  play: () => void;
  pause: () => void;
  destroy: () => void;
  // subscriptions
  onContentImpression: (cb: (props: { isAutoplay: boolean }) => void) => void;
  onResourceIdle: (cb: () => void) => void;
  onApiReady: (cb: () => void) => void;
  onPlayingStateChange: (cb: (state: PlayerPlayingState) => void) => void;
  onCurrentTimeChange: (cb: (state: { time: number }) => void) => void;
  onDurationChange: (cb: (state: { time: number }) => void) => void;
  onError: (cb: (state: { msg: string }) => void) => void;
}

export type PlayerIframeApi = {
  [Method in keyof PlayerPublicApi]: (
    ...data: Parameters<PlayerPublicApi[Method]>
  ) => Promise<ReturnType<PlayerPublicApi[Method]>>;
};

type InitPlayer = (props: {
  id: string;
  container: string;
}) => Promise<PlayerIframeApi>;

interface WindowWithPlayer {
  PLAYER: {
    init: InitPlayer;
    iframe: {
      init: InitPlayer;
    };
  };
}
export const getPlayerPublicApi = () => {
  const windowWithPublicApi = window as unknown as WindowWithPlayer;
  windowWithPublicApi.PLAYER = windowWithPublicApi.PLAYER || {};
  windowWithPublicApi.PLAYER.iframe = windowWithPublicApi.PLAYER.iframe || {};

  return windowWithPublicApi.PLAYER;
};
