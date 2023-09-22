import styles from './full-info.module.css';

import cn from 'clsx';
import { useMemo } from 'react';
import { PlayerPlayingState } from '@demo-video-app/player/src/public-api';
import { useApi } from '../../utils/use-api';
import { Banner } from '../banner/banner';
import { TextProgress } from '../text-progress/text-progress';
import { useFlags } from '../../utils/use-flags';
import { Fake } from '../fake/fake';

interface FullInfo {
  id: string;
  description: string;
  states: { progress: number; text: string; cover: string }[];
}

interface FullInfoProps {
  id: string;
  className: string;
  playingState: PlayerPlayingState;
  duration: number;
  currentTime: number;
}

const fakesWidth = ['100%', '93%', '96%', '98%', '84%'];

export function FullInfo({
  id,
  className,
  playingState,
  duration,
  currentTime,
}: FullInfoProps) {
  const { isLoading, response } = useApi<FullInfo>({ apiUrl: `/watch/${id}` });
  const { useFake } = useFlags();

  const fakes = useMemo(() => {
    if (!useFake) {
      return null;
    }
    return Array(5)
      .fill(null)
      .map((_, index) => (
        <Fake
          key={index}
          className={styles.fakeDescriptionLine}
          width={fakesWidth[index]}
          height={13}
          borderRadius={8}
        />
      ));
  }, [useFake]);

  if (isLoading && !useFake) {
    return null;
  }

  return (
    <div className={cn(styles.fullInfo, className)}>
      <TextProgress
        contentId={id}
        className={styles.textProgress}
        duration={duration}
        time={currentTime}
        states={response?.states || []}
        isLoading={isLoading}
      />
      <Banner
        isPaused={playingState === PlayerPlayingState.PAUSE}
        className={styles.banner}
      />
      <div className={styles.descriptionHeader}>Описание ролика:</div>
      {!isLoading ? (
        <div className={styles.description}>{response.description}</div>
      ) : (
        fakes
      )}
    </div>
  );
}
