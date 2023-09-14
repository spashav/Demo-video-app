import styles from './card.module.css';

import { Link } from 'react-router-dom';
import cn from 'clsx';

export function Card({
  id,
  cover,
  className,
  onClick,
}: {
  id: string;
  cover: string;
  className: string;
  onClick: () => void;
}) {
  return (
    <Link
      to={`/watch/${id}`}
      className={cn(styles.card, className)}
      onClick={onClick}
    >
      <div className={styles.ratio}></div>
      <div
        className={styles.cover}
        style={{ backgroundImage: `url("${cover}")` }}
      />
    </Link>
  );
}
