export type SubscriptionsMethods =
  | 'onApiReady'
  | 'onPlayingStateChange'
  | 'onCurrentTimeChange';
const settersMethods = ['play' , 'pause'] as const;
export type SettersMethods = typeof settersMethods[number];
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
  // subscriptions
  onApiReady: (cb: () => void) => void;
  onPlayingStateChange: (cb: (state: PlayerPlayingState) => void) => void;
  onCurrentTimeChange: (cb: (state: { time: number }) => void) => void;
}

export type PlayerIframeApi = {
  [Method in keyof PlayerPublicApi]: (
    ...data: Parameters<PlayerPublicApi[Method]>
  ) => Promise<ReturnType<PlayerPublicApi[Method]>>;
};

interface WindowWithPlayer {
  PLAYER: {
    iframe: {
      init: (props: {
        id: string;
        container: string;
      }) => Promise<PlayerIframeApi>;
    };
  };
}
export const getPlayerPublicApi = () => {
  const windowWithPublicApi = window as unknown as WindowWithPlayer;
  windowWithPublicApi.PLAYER = windowWithPublicApi.PLAYER || {};
  windowWithPublicApi.PLAYER.iframe = windowWithPublicApi.PLAYER.iframe || {};

  return windowWithPublicApi.PLAYER;
};
