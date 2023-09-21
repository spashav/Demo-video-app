import styles from './watch.module.css';

import { useCallback, useState, useEffect } from 'react';

import { useParams } from 'react-router-dom';
import { Player } from '../player/player';
import { Related } from '../related/related';
import { FullInfo } from '../full-info/full-info';
import { pageLib } from '../../utils/pages';
import { logMetric } from '../../utils/log-metric';
import { PlayerLib } from '../../utils/player-lib';
import { usePlayerState } from '../../utils/use-player-state';

export function Watch({ playerApi }: { playerApi: PlayerLib }) {
  const { id } = useParams();
  const duration = usePlayerState(playerApi, 'duration');
  const currentTime = usePlayerState(playerApi, 'currentTime');
  const playingState = usePlayerState(playerApi, 'playingState');

  useEffect(() => {
    return () => playerApi.destroy();
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
        <Player id={id} className={styles.player} playerApi={playerApi} />
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
        playerApi={playerApi}
        className={styles.related}
        onClick={handleRelatedClick}
      />
    </div>
  );
}
