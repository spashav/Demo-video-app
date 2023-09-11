import {
  isSettersMethod,
  PlayerApiMethods,
  PlayerPublicApi,
  SettersMethods,
  SubscriptionsMethods,
} from '@demo-video-app/player/src/public-api';
import { PlayerApi } from '@demo-video-app/player/src/components/player/player-api';

interface IframeInEventData<Method extends PlayerApiMethods> {
  apiMethod: Method;
  data: Method extends SubscriptionsMethods
    ? undefined
    : Parameters<PlayerPublicApi[Method]>;
  apiCallKey: number;
  source: 'iframe-player';
}

interface IframeOutEventData<Method extends PlayerApiMethods> {
  apiMethod: Method;
  result: Parameters<PlayerPublicApi[Method]>[0] extends (
      ...data: infer InnerData
    ) => void
    ? InnerData extends never
      ? undefined
      : InnerData
    : ReturnType<PlayerPublicApi[Method]>;
  apiCallKey: number;
  source: 'iframe-player';
}
export class PlayerApiInnerIframe extends PlayerApi {
  initPostMessageListener = () => {
    const unsubscribeFromApiReady = this.onApiReady(() => {
      const outData: IframeOutEventData<SubscriptionsMethods> = {
        result: undefined,
        apiCallKey: -1,
        apiMethod: 'onApiReady',
        source: 'iframe-player',
      };
      window.parent.postMessage(outData);
      unsubscribeFromApiReady();
    });

    const handleMessage = (event: MessageEvent) => {
      if (event.data.source !== 'iframe-player') {
        return;
      }
      proxyApiResultToParentWindow(event.data, this);
    };
    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
      unsubscribeFromApiReady();
    };
  };
}

const proxyApiResultToParentWindow = (
  { apiMethod, apiCallKey, data }: IframeInEventData<PlayerApiMethods>,
  playerApi: PlayerApi
) => {
  if (isSettersMethod(apiMethod)) {
    const result = playerApi[apiMethod].apply(playerApi, data as []);

    const outData: IframeOutEventData<SettersMethods> = {
      result,
      apiCallKey,
      apiMethod,
      source: 'iframe-player',
    };
    window.parent.postMessage(outData);
  } else {
    const api = playerApi[apiMethod];
    api((state?: any) => {
      const outData: IframeOutEventData<SubscriptionsMethods> = {
        result: state as any,
        apiCallKey,
        apiMethod,
        source: 'iframe-player',
      };
      window.parent.postMessage(outData);
    });
  }
};
