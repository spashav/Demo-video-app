import type { PlayerLib } from '../global-lib-bundle/player-lib';
import type { logError } from '../global-lib-bundle/log-error';
import type { pageLib } from '../global-lib-bundle/pages';
import type { logMetric } from '../global-lib-bundle/log-metric';

export interface GlobalLib {
  getPlayerLib: () => PlayerLib;
  logError: typeof logError;
  getPageLib: () => typeof pageLib;
  logMetric: typeof logMetric;
}
