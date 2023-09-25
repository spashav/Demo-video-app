import styles from './player.module.css';

import { useEffect, useState } from 'react';
import cn from 'clsx';
import { useFlags } from '../../utils/use-flags';
import { videoSourceCache } from '../../utils/api-cache';
import type { PlayerLib } from '../../global-lib-bundle/player-lib';

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
      <div
        className={styles.player}
        id={CONTAINER_ID}
        suppressHydrationWarning={true}
        dangerouslySetInnerHTML={{ __html: '' }}
      ></div>
      {useFake && !isPlayerReady && <div className={styles.cover} suppressHydrationWarning={true} />}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.INLINE_LIB.getPageLib().startFirstPage();
            window.APP_STATE.videoSource && window.INLINE_LIB.getPlayerLib().init({
              id: "${id}",
              container: "${CONTAINER_ID}",
              disableIframe: ${disableIframe},
              videoSource: window.APP_STATE.videoSource,
              coverSelector: ".${styles.cover}",
              scripts: window.APP_STATE.playerScripts,
            });
          `,
        }}
      ></script>
    </div>
  );
}
