import styles from './player.module.css';

import { useEffect, useState } from 'react';
import cn from 'clsx';
import { useFlags } from '../../utils/use-flags';
import { useVideoSourceCache } from '../../utils/api-cache';
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
  const videoSourceCache = useVideoSourceCache();
  const videoSource = videoSourceCache.get(id);
  const { useFake, disableIframe, useDelayedApp } = useFlags();
  useEffect(() => {
    if (!id) {
      return;
    }
    const videoSource = videoSourceCache.get(id);
    playerApi
      .init({
        id,
        container: CONTAINER_ID,
        disableIframe,
        useFirstFrame: Boolean(useDelayedApp),
        videoSource,
        backgroundColor: useFake ? 'transparent' : undefined,
        disableLoader: useFake,
      });
  }, [id]);

  return (
    <div className={cn(className, styles.playerCont)}>
      {useFake && <div
        className={styles.cover}
        style={
          useDelayedApp && videoSource
            ? { backgroundImage: `url("${videoSource.firstFrame}")` }
            : {}
        }
      />}
      <div
        className={styles.player}
        id={CONTAINER_ID}
        suppressHydrationWarning={true}
        dangerouslySetInnerHTML={{ __html: '' }}
      ></div>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.INLINE_LIB.getPageLib().startFirstPage();
            window.APP_STATE.videoSource && window.INLINE_LIB.getPlayerLib().init({
              id: "${id}",
              container: "${CONTAINER_ID}",
              disableIframe: ${disableIframe},
              videoSource: window.APP_STATE.videoSource,
              scripts: window.APP_STATE.playerScripts,
              useFirstFrame: "${useDelayedApp}",
              backgroundColor: ${useFake ? '"transparent"' : 'undefined'},
              disableLoader: ${useFake},
            });
          `,
        }}
      ></script>
    </div>
  );
}
