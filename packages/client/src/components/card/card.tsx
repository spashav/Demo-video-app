import styles from './card.module.css';

import { Link, useSearchParams } from 'react-router-dom';
import cn from 'clsx';
import { useEffect, useRef } from 'react';

function loadImg(src: string) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', resolve);
    image.addEventListener('error', reject);
    image.src = src;
  });
}

export function Card({
  id,
  cover,
  className,
  onClick,
  ratio,
  withPreload,
}: {
  id: string;
  cover: string;
  className: string;
  ratio: number;
  onClick?: (id: string) => void;
  withPreload?: boolean;
}) {
  const [searchParams] = useSearchParams()
  const coverRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!withPreload) {
      return
    }
    loadImg(cover).then(() => {
      if (coverRef.current) {
        coverRef.current.classList.remove(styles.isFake);
      }
    });
  }, [cover, withPreload]);
  return (
    <Link
      to={`/watch/${id}?${searchParams.toString()}`}
      className={cn(styles.card, className, withPreload ? styles.withPreload : null)}
      onClick={() => onClick?.(id)}
    >
      <div
        className={styles.ratio}
        style={{ paddingBottom: `${ratio * 100}%` }}
      />
      <div
        ref={coverRef}
        className={cn(styles.cover, withPreload ? styles.isFake : null)}
        style={{ backgroundImage: `url("${cover}")` }}
      />
    </Link>
  );
}
