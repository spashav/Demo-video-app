import { initGlobalLib } from '../global-lib-bundle';
import { getGlobalLib } from '../utils/get-global-lib';

const inlineLib = getGlobalLib();
Object.assign(inlineLib, initGlobalLib());
