import {
  isSettersMethod,
  PlayerPublicApi,
  SettersMethods,
  SubscriptionsMethods,
  PlayerApiMethods,
} from '../public-api';
import {
  sendMessageToIframe,
  IframeInEventData,
  IframeOutEventData,
} from '../utils/iframe-messages';

export class PlayerIframeApiAdapter implements PlayerPublicApi {
  constructor(private iframeWindow: WindowProxy) {}
  private proxyApiMethod =
    (apiMethod: SettersMethods) =>
    (
      ...data: Parameters<PlayerPublicApi[SettersMethods]>
    ): Promise<ReturnType<PlayerPublicApi[SettersMethods]>> => {
      const apiCallKey = uniqueApiKey++;
      sendMessageToIframe({
        apiMethod,
        data,
        apiCallKey,
        iframeWindow: this.iframeWindow,
      });
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
    ): ReturnType<PlayerPublicApi[SubscriptionsMethods]> => {
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

      return () => {
        delete subscriptionsCallbacks[apiCallKey]
      };
    };

  public play = this.proxyApiMethod('play');
  public pause = this.proxyApiMethod('pause');
  public destroy = async () => {
    Object.keys(subscriptionsCallbacks).forEach(
      (key) => delete subscriptionsCallbacks[key]
    );
    Object.keys(apiCallbacks).forEach((key) => delete apiCallbacks[key]);
  };

  public onApiReady = this.proxyApiSubscriptions('onApiReady');
  public onError = this.proxyApiSubscriptions('onError');
  public onPlayingStateChange = this.proxyApiSubscriptions(
    'onPlayingStateChange'
  );
  public onCurrentTimeChange = this.proxyApiSubscriptions(
    'onCurrentTimeChange'
  );
  public onDurationChange = this.proxyApiSubscriptions(
    'onDurationChange'
  );
  public onResourceIdle = this.proxyApiSubscriptions('onResourceIdle');
  public onContentImpression = this.proxyApiSubscriptions(
    'onContentImpression'
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
