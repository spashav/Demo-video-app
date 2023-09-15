export const eventEmitter = <Params extends Array<unknown> = []>() => {
  type Callback = (...params: Params) => void;
  let callbacks: Array<{
    cb: Callback;
    once: boolean;
  }> = [];
  const removeCb = (cb: Callback) => {
    callbacks = callbacks.filter((savedCb) => savedCb.cb !== cb);
  };
  return {
    on: (cb: Callback, once = false) => {
      callbacks.push({ cb, once });
      return () => removeCb(cb);
    },
    emit: (...param: Params) => {
      [...callbacks].forEach(({ cb, once }) => {
        cb(...param);
        if (once) {
          removeCb(cb);
        }
      });
    },
  };
};
