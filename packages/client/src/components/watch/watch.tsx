import styles from './watch.module.css';

import { useCallback, useEffect } from 'react';

import { useParams } from 'react-router-dom';
import { Player } from '../player/player';
import { Related } from '../related/related';
import { FullInfo } from '../full-info/full-info';
import { usePlayerState } from '../../utils/use-player-state';
import { GlobalLib } from '../../types/global-lib';

export function Watch({ globalLib }: { globalLib: GlobalLib }) {
  const { id } = useParams();
  const playerApi = globalLib.getPlayerLib();
  const duration = usePlayerState(playerApi, 'duration');
  const currentTime = usePlayerState(playerApi, 'currentTime');
  const playingState = usePlayerState(playerApi, 'playingState');

  useEffect(() => {
    return () => playerApi.destroy();
  }, []);

  const handleRelatedClick = useCallback((id: string) => {
    globalLib.logMetric('Click related', id);
    globalLib.getPageLib().startPage();
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
