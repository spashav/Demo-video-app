import styles from './text-progress.module.css';
import * as _ from 'lodash';
import cn from 'clsx';
import { formatDuration } from '../../utils/format-duration';
import { Card } from '../card/card';

export function TextProgress({
  time,
  duration,
  className,
  states,
  contentId,
}: {
  time: number;
  duration: number;
  states: { progress: number; text: string; cover: string }[];
  className: string;
  contentId: string;
}) {
  const currentProgress = duration ? (100 * time) / duration : 0;
  const state = _.find(states, (_, index) => {
    const nextState = states[index + 1];
    if (!nextState || nextState.progress > currentProgress) {
      return true;
    }
    return false;
  });
  if (!state) {
    return null;
  }

  return (
    <div className={cn(styles.textProgress, className)}>
      <div className={styles.grid}>
        {states.map(({ progress, text, cover }, index) => {
          return (
            <div className={styles.item} key={index}>
              <Card
                className={styles.itemCover}
                ratio={0.405}
                cover={cover}
                id={contentId}
                onClick={() => {}}
              />
              <div className={styles.itemTime}>
                {duration === 0 ? '' : formatDuration(duration * progress)}
              </div>
              <div className={styles.itemText}>
                <div className={styles.itemTextInner}>{text}</div>
              </div>
            </div>
          );
        })}
      </div>
      <div className={styles.progress}>
        <div className={styles.backLine} />
        <div
          className={styles.timeLine}
          style={{ backgroundSize: `${currentProgress}% 4px` }}
        />
      </div>
    </div>
  );
}
