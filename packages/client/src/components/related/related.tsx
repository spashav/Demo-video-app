import styles from './related.module.css';

import cn from 'clsx';
import { useMemo } from 'react';

import { useApi } from '../../utils/use-api';
import { Card } from '../card/card';
import { useFlags } from '../../utils/use-flags';
import { Fake } from '../fake/fake';

interface RelatedItem {
  id: string;
  cover: string;
}
export function Related({
  id,
  className,
  onClick,
}: {
  id: string;
  className: string;
  onClick: (id: string) => void;
}) {
  const related = useApi<RelatedItem[]>({ apiUrl: `/related?id=${id}` });
  const { useFake } = useFlags();

  const fakes = useMemo(() => {
    if (!useFake) {
      return null
    }
    return Array(10)
      .fill(null)
      .map((_, index) => (
        <Fake
          className={styles.card}
          ratio={0.6122}
          borderRadius={16}
          key={index}
        />
      ));
  }, [useFake]);

  return (
    <div className={cn(className, styles.related)}>
      <div className={styles.title}>Рекомендации</div>
      {!related.isLoading
        ? related.response.map(({ id, cover }) => (
            <Card
              cover={cover}
              id={id}
              key={id}
              className={styles.card}
              onClick={onClick}
              ratio={0.6122}
              withPreload={useFake}
            />
          ))
        : fakes}
    </div>
  );
}
