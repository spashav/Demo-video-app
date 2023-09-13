import styles from './player.module.css';

import { useEffect } from 'react';
import cn from 'clsx';
import { getPlayerPublicApi } from '@demo-video-app/player/src/public-api';

const CONTAINER_ID = '#player';

export function Player({ id, className }: { id: string; className: string }) {
  useEffect(() => {
    if (!id) {
      return;
    }
    const playerApiPromise = getPlayerPublicApi().iframe.init({
      id,
      container: CONTAINER_ID,
    });
    playerApiPromise.then((playerApi) => {
      playerApi.onCurrentTimeChange((state) => {
        console.log('onPlayingStateChange', state);
      });
    });
  }, [id]);

  return (
    <div className={cn(className, styles.playerCont)}>
      <div className={styles.player} id={CONTAINER_ID}></div>
    </div>
  );
}
