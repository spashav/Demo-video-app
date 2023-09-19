import styles from './player.module.css';

import { useEffect, useState } from 'react';
import cn from 'clsx';
import {
  getPlayerPublicApi,
  PlayerIframeApi,
} from '@demo-video-app/player/src/public-api';
import { useFlags } from '../../utils/use-flags';

const CONTAINER_ID = '#player';

export function Player({
  id,
  className,
  onApiLoad,
}: {
  id: string;
  className: string;
  onApiLoad: (api: PlayerIframeApi) => void;
}) {
  const [isPlayerReady, setIsPlayerReady] = useState(false)
  const { useFake } = useFlags();
  useEffect(() => {
    if (!id) {
      return;
    }
    setIsPlayerReady(false)
    const playerApiPromise = getPlayerPublicApi().init({
      id,
      container: CONTAINER_ID,
    });
    playerApiPromise.then((api) => {
      onApiLoad(api)
      setIsPlayerReady(true)
    });
    return () => {
      playerApiPromise.then((api) => api.destroy());
    };
  }, [id]);

  return (
    <div className={cn(className, styles.playerCont)}>
      <div className={styles.player} id={CONTAINER_ID}></div>
      {useFake && !isPlayerReady && (
        <div className={styles.cover} />
      )}
    </div>
  );
}
