import { PlayerApi } from '../player/player-api';
import {
  proxyApiResultToParentWindow,
  sendMessageToParent,
} from '../../utils/iframe-messages';

export class PlayerApiInnerIframe extends PlayerApi {
  public initPostMessageListener = () => {
    const unsubscribeFromApiReady = this.onApiReady(() => {
      sendMessageToParent({
        result: undefined,
        apiCallKey: -1,
        apiMethod: 'onApiReady',
      });
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
