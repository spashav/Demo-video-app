import { PlayerLib } from './player-lib';
import { logError } from './log-error';
import { pageLib } from './pages';
import { logMetric } from './log-metric';

export const initGlobalLib = () => {
  const playerLib = new PlayerLib();
  let isRelatedFirstRenderLogged = false
  return {
    getPlayerLib: () => playerLib,
    logError,
    getPageLib: () => pageLib,
    logMetric,
    logRelatedFirstRender: () => {
      const isFirst = pageLib.getCurrent()?.isFirst
      if (isFirst && !isRelatedFirstRenderLogged) {
        isRelatedFirstRenderLogged = true
        logMetric('Related first render', performance.now());
      }
    }
  };
};
