import styles from './banner.module.css';
import cn from 'clsx';
import * as _ from 'lodash';
import { useEffect, useMemo, useState } from 'react';

export function Banner({
  isPaused,
  className,
}: {
  isPaused: boolean;
  className: string;
}) {
  const [isPausedInner, setIsPaused] = useState(isPaused);
  const setIsPausedDebounce = useMemo(() => _.debounce(setIsPaused, 100), []);
  useEffect(() => {
    setIsPausedDebounce(isPaused);
  }, [isPaused]);

  if (!isPausedInner) {
    return null;
  }

  return (
    <div
      className={cn(styles.banner, className)}
    ></div>
  );
}
