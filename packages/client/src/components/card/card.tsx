import styles from './card.module.css';

import { Link } from 'react-router-dom';
import cn from 'clsx';

export function Card({
  id,
  cover,
  className,
  onClick,
  ratio,
}: {
  id: string;
  cover: string;
  className: string;
  ratio: number;
  onClick: (id: string) => void;
}) {
  return (
    <Link
      to={`/watch/${id}`}
      className={cn(styles.card, className)}
      onClick={() => onClick(id)}
    >
      <div
        className={styles.ratio}
        style={{ paddingBottom: `${ratio * 100}%` }}
      ></div>
      <div
        className={styles.cover}
        style={{ backgroundImage: `url("${cover}")` }}
      />
    </Link>
  );
}
