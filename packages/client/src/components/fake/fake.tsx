import styles from './fake.module.css';

import cn from 'clsx';

export function Fake({
  className,
  ratio,
  width,
  height,
  borderRadius,
}: {
  className?: string;
  ratio?: number;
  width?: number | string;
  height?: number | string;
  borderRadius: number;
}) {
  if (ratio) {
    return (
      <div className={cn(styles.fake, className)} style={{ borderRadius }}>
        <div style={{ paddingBottom: `${ratio * 100}%` }} />
      </div>
    );
  }

  return (
    <div
      className={cn(styles.fake, className)}
      style={{ width, height, borderRadius }}
    />
  );
}
