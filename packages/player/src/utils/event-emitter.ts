export const eventEmitter = <Params = undefined>(initialParams?: Params) => {
  type Callback = (...param: Params extends undefined ? [] : [Params]) => void;
  let callbacks: Array<{
    cb: Callback;
    once: boolean;
  }> = [];
  const removeCb = (cb: Callback) => {
    callbacks = callbacks.filter((savedCb) => savedCb.cb !== cb);
  };
  let lastParams: Params | undefined = initialParams;
  return {
    on: (cb: Callback, once = false) => {
      callbacks.push({ cb, once });
      return () => removeCb(cb);
    },
    emit: (...param: Params extends undefined ? [] : [Params]) => {
      lastParams = param[0];
      [...callbacks].forEach(({ cb, once }) => {
        cb(...param);
        if (once) {
          removeCb(cb);
        }
      });
    },
    getEventParams: () => lastParams,
  };
};
