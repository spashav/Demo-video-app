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
import { useVideoSourceCache } from '../../utils/api-cache';
import { InitialClientState } from '../../types/initial-client-state';
import { GlobalLib } from '@demo-video-app/client/src/types/global-lib';

export const START_SECOND_CHUNK = '__START_SECOND_CHUNK__';
export const FINISH_SECOND_CHUNK = '__FINISH_SECOND_CHUNK__';

interface RelatedItem {
  id: string;
  cover: string;
  playerConfig?: VideoSource;
}
export function Related({
  id,
  className,
  globalLib,
  onClick,
  initialRelated,
}: {
  id: string;
  className: string;
  globalLib: GlobalLib;
  onClick: (id: string) => void;
  initialRelated?: InitialClientState['related'];
}) {
  const {
    useFake,
    usePreloadAndDelayedRelated,
    useChunkedRendering,
    useDelayedApp,
  } = useFlags();
  const isChunkedRendering =
    useDelayedApp && useChunkedRendering && typeof window === 'undefined';
  const videoSourceCache = useVideoSourceCache();

  const awaitPlayerLoadPromise = useMemo(() => {
    if (!usePreloadAndDelayedRelated) {
      return Promise.resolve();
    }
    return new Promise<void>((resolve) => {
      const playerApi = globalLib.getPlayerLib();
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
  }, [id, globalLib]);

  const related = useApi<RelatedItem[]>({
    apiUrl: `/related?id=${id}`,
    awaitPromise: awaitPlayerLoadPromise,
    initial: initialRelated,
  });

  useEffect(() => {
    if (!related.isLoading) {
      globalLib.logRelatedFirstRender();
      related.response.forEach(
        ({ id, playerConfig }) =>
          playerConfig && videoSourceCache.set(id, playerConfig)
      );
    }
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
      <div className={styles.fakes}>{fakes}</div>
      {isChunkedRendering ? START_SECOND_CHUNK : ''}
      {!related.isLoading &&
        related.response.map(({ id, cover }) => (
          <Card
            cover={cover}
            id={id}
            key={id}
            className={styles.card}
            onClick={onClick}
            ratio={0.6122}
            withPreload={useFake && !related.isInitial}
          />
        ))}
      {isChunkedRendering ? FINISH_SECOND_CHUNK : ''}
      {useDelayedApp && useChunkedRendering && (
        <script
          dangerouslySetInnerHTML={{
            __html: 'window.INLINE_LIB.logRelatedFirstRender();',
          }}
        ></script>
      )}
    </div>
  );
}
