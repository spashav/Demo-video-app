import styles from './player.module.css';

import { useEffect } from 'react';
import cn from 'clsx';
import {
  getPlayerPublicApi,
  PlayerIframeApi,
} from '@demo-video-app/player/src/public-api';

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
  useEffect(() => {
    if (!id) {
      return;
    }
    const playerApiPromise = getPlayerPublicApi().iframe.init({
      id,
      container: CONTAINER_ID,
    });
    playerApiPromise.then(onApiLoad);
  }, [id]);

  return (
    <div className={cn(className, styles.playerCont)}>
      <div className={styles.player} id={CONTAINER_ID}></div>
    </div>
  );
}
