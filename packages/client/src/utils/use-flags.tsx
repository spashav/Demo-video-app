import { useContext, createContext, FC, ReactNode, useState } from 'react';
import type { Request } from 'express';

enum FlagKeys {
  useFake = 'useFake',
  disableIframe = 'disableIframe',
  usePreloadAndDelayedRelated = 'usePreloadAndDelayedRelated',
  useDelayedApp = 'useDelayedApp',
  useChunkedRendering = 'useChunkedRendering',
}
interface Flags {
  [FlagKeys.useFake]: boolean;
  [FlagKeys.disableIframe]: boolean;
  [FlagKeys.usePreloadAndDelayedRelated]: boolean;
  [FlagKeys.useDelayedApp]: boolean;
  [FlagKeys.useChunkedRendering]: boolean;
}

const defaultFlags: Flags = {
  [FlagKeys.useFake]: false,
  [FlagKeys.disableIframe]: false,
  [FlagKeys.usePreloadAndDelayedRelated]: false,
  [FlagKeys.useDelayedApp]: false,
  [FlagKeys.useChunkedRendering]: false,
};

const flagsContext = createContext<Flags>(defaultFlags);

const FlagsContextProviderInner = flagsContext.Provider;

export const useFlags = () => {
  return useContext(flagsContext);
};

export const FlagsContextProvider: FC<{
  req?: Request;
  children: ReactNode;
}> = ({ children, req }) => {
  const [flags] = useState<Flags>(() => {
    const flagsCopy = { ...defaultFlags };
    if (req) {
      Object.entries(req.query).forEach(([key, value]) => {
        if (key in FlagKeys) {
          flagsCopy[key as FlagKeys] = value !== '0';
        }
      });
    } else {
      const urlSearchParams = new URLSearchParams(window.location.search);
      urlSearchParams.forEach((value, key) => {
        if (key in FlagKeys) {
          flagsCopy[key as FlagKeys] = value !== '0';
        }
      });
    }
    return flagsCopy;
  });

  return (
    <FlagsContextProviderInner value={flags}>
      {children}
    </FlagsContextProviderInner>
  );
};
