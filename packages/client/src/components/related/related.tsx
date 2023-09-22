import styles from './related.module.css';

import cn from 'clsx';
import { useEffect, useMemo } from 'react';

import {
  PlayerState,
  VideoSource,
} from '@demo-video-app/player/src/public-api';
import type { PlayerLib } from '../../global-lib-bundle/player-lib';
import { useApi } from '../../utils/use-api';
import { Card } from '../card/card';
import { useFlags } from '../../utils/use-flags';
import { Fake } from '../fake/fake';
import { videoSourceCache } from '../../utils/api-cache';

interface RelatedItem {
  id: string;
  cover: string;
  playerConfig?: VideoSource;
}
export function Related({
  id,
  className,
  playerApi,
  onClick,
}: {
  id: string;
  className: string;
  playerApi: PlayerLib;
  onClick: (id: string) => void;
}) {
  const { useFake, usePreloadAndDelayedRelated } = useFlags();

  const awaitPlayerLoadPromise = useMemo(() => {
    if (!usePreloadAndDelayedRelated) {
      return Promise.resolve();
    }
    return new Promise<void>((resolve) => {
      const check = () => {
        const state = playerApi.getState('playerState');
        if (state === PlayerState.INITED || state === PlayerState.DESTROYED) {
          unsubscribe();
          return resolve();
        }
      };
      let unsubscribe = playerApi.subscribeOnStateChange('playerState', check);
      check();
    });
  }, [id, playerApi]);

  const related = useApi<RelatedItem[]>({
    apiUrl: `/related?id=${id}`,
    awaitPromise: awaitPlayerLoadPromise,
  });

  useEffect(() => {
    related.response?.forEach(
      ({ id, playerConfig }) =>
        playerConfig && videoSourceCache.set(id, playerConfig)
    );
  }, [related.response]);

  const fakes = useMemo(() => {
    if (!useFake) {
      return null;
    }
    return Array(10)
      .fill(null)
      .map((_, index) => (
        <Fake
          className={styles.card}
          ratio={0.6122}
          borderRadius={16}
          key={index}
        />
      ));
  }, [useFake]);

  return (
    <div className={cn(className, styles.related)}>
      <div className={styles.title}>Рекомендации</div>
      {!related.isLoading
        ? related.response.map(({ id, cover }) => (
            <Card
              cover={cover}
              id={id}
              key={id}
              className={styles.card}
              onClick={onClick}
              ratio={0.6122}
              withPreload={useFake}
            />
          ))
        : fakes}
    </div>
  );
}
