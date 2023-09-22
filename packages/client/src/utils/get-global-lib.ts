import { GlobalLib } from '../types/global-lib';
import { initGlobalLib } from '../global-lib-bundle';

interface WindowWithInlineGlobalLib {
  INLINE_LIB: GlobalLib;
}
export const getGlobalLib = (): GlobalLib => {
  if (typeof window === 'undefined') {
    return initGlobalLib();
  }
  const windowWithInlineLib = window as unknown as WindowWithInlineGlobalLib;
  windowWithInlineLib.INLINE_LIB = windowWithInlineLib.INLINE_LIB || {};
  return windowWithInlineLib.INLINE_LIB;
};
