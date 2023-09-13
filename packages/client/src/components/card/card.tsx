import styles from './card.module.css';

import { Link } from 'react-router-dom';
import cn from 'clsx';

export function Card({
  id,
  cover,
  className,
}: {
  id: string;
  cover: string;
  className: string;
}) {
  return (
    <Link to={`/watch/${id}`} className={cn(styles.card, className)}>
      <div className={styles.ratio}></div>
      <div
        className={styles.cover}
        style={{ backgroundImage: `url("${cover}")` }}
      />
    </Link>
  );
}
