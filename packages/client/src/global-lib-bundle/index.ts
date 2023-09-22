import { PlayerLib } from './player-lib';
import { logError } from './log-error';
import { pageLib } from './pages';
import { logMetric } from './log-metric';

export const initGlobalLib = () => {
  const playerLib = new PlayerLib();
  return {
    getPlayerLib: () => playerLib,
    logError,
    getPageLib: () => pageLib,
    logMetric,
  };
};
