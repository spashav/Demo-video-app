import { InitialClientState } from '../types/initial-client-state';

export const getInitialClientState = () => {
  if (typeof window === 'undefined') {
    return {}
  }
  return (window as unknown as any).APP_STATE as InitialClientState;
};
