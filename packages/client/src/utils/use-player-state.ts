import type { PlayerLib, PlayerLibState } from '../global-lib-bundle/player-lib';
import { useEffect, useState } from 'react';

export const usePlayerState = <StateKey extends keyof PlayerLibState>(
  playerLib: PlayerLib,
  key: StateKey
) => {
  const [value, setValue] = useState(playerLib.getState(key));
  useEffect(() => {
    return playerLib.subscribeOnStateChange(key, setValue);
  }, [playerLib]);
  return value;
};
