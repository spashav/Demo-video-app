import styles from './watch.module.css';

import { useCallback } from 'react';

import { useParams } from 'react-router-dom';
import type { PlayerIframeApi } from '@demo-video-app/player/src/public-api';
import { Player } from '../player/player';
import { Related } from '../related/related';
import { FullInfo } from '../full-info/full-info';
import { pageLib } from '../../utils/pages';

export function Watch() {
  const { id } = useParams();
  const handleApiLoad = useCallback((playerApi: PlayerIframeApi) => {
    playerApi.onCurrentTimeChange(() => {
      //console.log('onPlayingStateChange', state);
    });
    playerApi.onResourceIdle(() => {
      console.log('onResourceIdle');
    });
    playerApi.onContentImpression(() => {
      const time = performance.now();
      const { time: startTime, isFirst } = pageLib.getCurrent();
      if (isFirst) {
        console.log('First start', time);
      } else {
        console.log('Spa start', time - startTime);
      }
    });
  }, []);

  const handleRelatedClick = useCallback(() => {
    pageLib.startPage();
  }, []);

  if (!id) {
    return <div className={styles.watch}>Empty id in url</div>;
  }
  return (
    <div className={styles.watch}>
      <div className={styles.main}>
        <Player id={id} className={styles.player} onApiLoad={handleApiLoad} />
        <FullInfo id={id} className={styles.description} />
      </div>
      <Related
        id={id}
        className={styles.related}
        onClick={handleRelatedClick}
      />
    </div>
  );
}
