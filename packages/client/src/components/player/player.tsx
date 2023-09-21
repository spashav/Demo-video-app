import styles from './player.module.css';

import { useEffect, useState } from 'react';
import cn from 'clsx';
import { useFlags } from '../../utils/use-flags';
import { PlayerLib } from '../../utils/player-lib';
import { videoSourceCache } from '../../utils/api-cache';

const CONTAINER_ID = '#player';

export function Player({
  id,
  className,
  playerApi,
}: {
  id: string;
  className: string;
  playerApi: PlayerLib;
}) {
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const { useFake, disableIframe } = useFlags();
  useEffect(() => {
    if (!id) {
      return;
    }
    const videoSource = videoSourceCache.get(id);
    setIsPlayerReady(false);
    playerApi
      .init({
        id,
        container: CONTAINER_ID,
        disableIframe,
        videoSource,
      })
      .then(() => setIsPlayerReady(true));
  }, [id]);

  return (
    <div className={cn(className, styles.playerCont)}>
      <div className={styles.player} id={CONTAINER_ID}></div>
      {useFake && !isPlayerReady && <div className={styles.cover} />}
    </div>
  );
}
