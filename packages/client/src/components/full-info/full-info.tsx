import styles from './full-info.module.css';

import cn from 'clsx';
import { PlayerPlayingState } from '@demo-video-app/player/src/public-api';
import { useApi } from '../../utils/use-api';
import { Banner } from '../banner/banner';
import { TextProgress } from '../text-progress/text-progress';

interface FullInfo {
  id: string;
  title: string;
  description: string;
  states: { progress: number; text: string }[];
}

interface FullInfoProps {
  id: string;
  className: string;
  playingState: PlayerPlayingState;
  duration: number;
  currentTime: number;
}

export function FullInfo({
  id,
  className,
  playingState,
  duration,
  currentTime,
}: FullInfoProps) {
  const fullInfo = useApi<FullInfo>({ apiUrl: `/watch/${id}` });
  if (!fullInfo.response) {
    return null;
  }
  return (
    <div className={cn(styles.fullInfo, className)}>
      <h1 className={styles.title}>{fullInfo.response.title}</h1>
      <div className={styles.description}>{fullInfo.response.description}</div>
      <Banner
        isPaused={playingState === PlayerPlayingState.PAUSE}
        className={styles.banner}
      />
      <TextProgress
        className={styles.textProgress}
        duration={duration}
        time={currentTime}
        states={fullInfo.response.states}
      />
    </div>
  );
}
