import {
  isSettersMethod,
  PlayerPublicApi,
  SettersMethods,
  SubscriptionsMethods,
  PlayerApiMethods,
} from '@demo-video-app/player/src/public-api';

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

export class PlayerIframeApiAdapter implements PlayerPublicApi {
  constructor(private iframeWindow: WindowProxy) {}
  private proxyApiMethod =
    (apiMethod: SettersMethods) =>
    (
      ...data: Parameters<PlayerPublicApi[SettersMethods]>
    ): Promise<ReturnType<PlayerPublicApi[SettersMethods]>> => {
      const apiCallKey = uniqueApiKey++;
      const inData: IframeInEventData<SettersMethods> = {
        apiMethod,
        data,
        apiCallKey,
        source: 'iframe-player',
      };
      this.iframeWindow.postMessage(inData);

      return new Promise((resolve) => {
        apiCallbacks[apiCallKey] = (data) => {
          resolve(data.result as any);
        };
      });
    };

  private proxyApiSubscriptions =
    (apiMethod: SubscriptionsMethods) =>
    (
      cb: Parameters<PlayerPublicApi[SubscriptionsMethods]>[0]
    ): Promise<ReturnType<PlayerPublicApi[SubscriptionsMethods]>> => {
      const apiCallKey = uniqueApiKey++;
      subscriptionsCallbacks[apiCallKey] = (data) => {
        cb(data.result as any);
      };

      const inData: IframeInEventData<SubscriptionsMethods> = {
        apiMethod,
        data: undefined,
        apiCallKey,
        source: 'iframe-player',
      };
      this.iframeWindow.postMessage(inData);

      return Promise.resolve();
    };

  public play = this.proxyApiMethod('play');
  public pause = this.proxyApiMethod('pause');

  public onApiReady = this.proxyApiSubscriptions('onApiReady');
  public onPlayingStateChange = this.proxyApiSubscriptions(
    'onPlayingStateChange'
  );
  public onCurrentTimeChange = this.proxyApiSubscriptions(
    'onCurrentTimeChange'
  );

  public initPostMessageListener = (onApiReady: () => void) => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.source !== 'iframe-player') {
        return undefined;
      }
      const data: IframeOutEventData<PlayerApiMethods> = event.data;
      if (data.apiMethod === 'onApiReady') {
        onApiReady();
      }
      if (isSettersMethod(data.apiMethod)) {
        const cb = apiCallbacks[data.apiCallKey];
        cb?.(data as IframeOutEventData<SettersMethods>);
        delete apiCallbacks[data.apiCallKey];
      } else {
        const cb = subscriptionsCallbacks[data.apiCallKey];
        cb?.(data as IframeOutEventData<SubscriptionsMethods>);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  };
}
let uniqueApiKey = 1;

const apiCallbacks: Record<
  string,
  (data: IframeOutEventData<SettersMethods>) => void
> = {};

const subscriptionsCallbacks: Record<
  string,
  (data: IframeOutEventData<SubscriptionsMethods>) => void
> = {};
