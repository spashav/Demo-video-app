import {
  isSettersMethod,
  PlayerApiMethods,
  PlayerPublicApi,
  SubscriptionsMethods,
} from '@demo-video-app/player/src/public-api';
import { PlayerApi } from '@demo-video-app/player/src/components/player/player-api';

export interface IframeInEventData<Method extends PlayerApiMethods> {
  apiMethod: Method;
  data: Method extends SubscriptionsMethods
    ? undefined
    : Parameters<PlayerPublicApi[Method]>;
  apiCallKey: number;
  source: 'iframe-player';
}

export interface IframeOutEventData<Method extends PlayerApiMethods> {
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

export const proxyApiResultToParentWindow = (
  { apiMethod, apiCallKey, data }: IframeInEventData<PlayerApiMethods>,
  playerApi: PlayerApi
) => {
  if (isSettersMethod(apiMethod)) {
    const result = playerApi[apiMethod].apply(playerApi, data as []);

    sendMessageToParent({
      result,
      apiCallKey,
      apiMethod,
    });
  } else {
    const api = playerApi[apiMethod];
    api((state?: any) => {
      sendMessageToParent({
        result: state,
        apiCallKey,
        apiMethod,
      });
    });
  }
};

export const sendMessageToParent = ({
  result,
  apiCallKey,
  apiMethod,
}: {
  result: IframeOutEventData<PlayerApiMethods>['result'];
  apiCallKey: number;
  apiMethod: PlayerApiMethods;
}) => {
  const outData: IframeOutEventData<PlayerApiMethods> = {
    result,
    apiCallKey,
    apiMethod,
    source: 'iframe-player',
  };
  window.parent.postMessage(outData);
};

export const sendMessageToIframe = ({
  data,
  apiCallKey,
  apiMethod,
  iframeWindow
}: {
  data: IframeInEventData<PlayerApiMethods>['data'];
  apiCallKey: number;
  apiMethod: PlayerApiMethods;
  iframeWindow: WindowProxy
}) => {
  const inData: IframeInEventData<PlayerApiMethods> = {
    data,
    apiCallKey,
    apiMethod,
    source: 'iframe-player',
  };
  iframeWindow.postMessage(inData);
};
