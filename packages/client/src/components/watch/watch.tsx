import styles from './watch.module.css';

import { useCallback, useState } from 'react';

import { useParams } from 'react-router-dom';
import {
  PlayerIframeApi,
  PlayerPlayingState,
} from '@demo-video-app/player/src/public-api';
import { Player } from '../player/player';
import { Related } from '../related/related';
import { FullInfo } from '../full-info/full-info';
import { pageLib } from '../../utils/pages';
import { logError } from '../../utils/log-error';
import { logMetric } from '../../utils/log-metric';

interface WindowWithHiddenState {
  isHiddenWhileLoad: boolean;
}

export function Watch() {
  const { id } = useParams();
  const [playingState, setPlayingState] = useState<PlayerPlayingState>(
    PlayerPlayingState.NOT_STARTED
  );
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const handleApiLoad = useCallback((playerApi: PlayerIframeApi) => {
    playerApi.onCurrentTimeChange(({ time }) => setCurrentTime(time));
    playerApi.onDurationChange(({ time }) => setDuration(time));
    playerApi.onPlayingStateChange(setPlayingState);
    playerApi.onError(({ msg }) => logError(msg));
    playerApi.onContentImpression(() => {
      const windowWithHiddenState = window as unknown as WindowWithHiddenState;
      const time = performance.now();
      const { time: startTime, isFirst } = pageLib.getCurrent();
      if (isFirst) {
        !windowWithHiddenState.isHiddenWhileLoad &&
          logMetric('First start', time);
      } else {
        logMetric('Spa start', time - startTime);
      }
    });
  }, []);

  const handleRelatedClick = useCallback((id: string) => {
    logMetric('Click related', id);
    pageLib.startPage();
  }, []);

  if (!id) {
    return <div className={styles.watch}>Empty id in url</div>;
  }
  return (
    <div className={styles.watch}>
      <div className={styles.main}>
        <Player id={id} className={styles.player} onApiLoad={handleApiLoad} />
        <FullInfo
          id={id}
          className={styles.description}
          playingState={playingState}
          duration={duration}
          currentTime={currentTime}
        />
      </div>
      <Related
        id={id}
        className={styles.related}
        onClick={handleRelatedClick}
      />
    </div>
  );
}
