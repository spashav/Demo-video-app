import styles from './text-progress.module.css';
import * as _ from 'lodash';
import cn from 'clsx';

export function TextProgress({
  time,
  duration,
  className,
  states,
}: {
  time: number;
  duration: number;
  states: { progress: number; text: string }[];
  className: string;
}) {
  const currentProgress = (100 * time) / duration;
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

  return <div className={cn(styles.textProgress, className)}>{state.text}</div>;
}
