import styles from './text-progress.module.css';
import * as _ from 'lodash';
import cn from 'clsx';
import { formatDuration } from '../../utils/format-duration';
import { Card } from '../card/card';
import { useFlags } from '../../utils/use-flags';
import { Fake } from '../fake/fake';

export function TextProgress({
  time,
  duration,
  className,
  states,
  contentId,
  isLoading,
}: {
  time: number;
  duration: number;
  states: { progress: number; text: string; cover: string }[];
  className: string;
  contentId: string;
  isLoading: boolean;
}) {
  const { useFake } = useFlags();
  if (isLoading) {
    return (
      <div className={cn(styles.textProgress, className)}>
        <div className={styles.grid}>
          {Array(8)
            .fill(null)
            .map((_, index) => {
              return (
                <div className={styles.item} key={index}>
                  <Fake
                    className={styles.itemCover}
                    ratio={0.405}
                    borderRadius={8}
                  />
                  <div className={styles.itemText}>
                    <div className={styles.itemTime}/>
                    <Fake
                      className={styles.itemCover}
                      width={'75%'}
                      height={10}
                      borderRadius={8}
                    />
                  </div>
                </div>
              );
            })}
        </div>
        <div className={styles.progress} style={{ height: 4 }}>
          <div className={styles.backLine} />
        </div>
      </div>
    );
  }
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
                withPreload={useFake}
              />
              <div className={styles.itemText}>
                <div className={styles.itemTime}>
                  {duration === 0 ? '' : formatDuration(duration * progress)}
                </div>
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
