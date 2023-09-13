import styles from './related.module.css';

import cn from 'clsx';

import { useApi } from '../../utils/use-api';
import { Card } from '../card/card';

interface RelatedItem {
  id: string;
  cover: string;
}
export function Related({ id, className }: { id: string; className: string }) {
  const related = useApi<RelatedItem[]>({ apiUrl: `/related?id=${id}` });

  return (
    <div className={cn(className, styles.main)}>
      {related.response
        ? related.response.map(({ id, cover }) => (
            <Card cover={cover} id={id} key={id} className={styles.card} />
          ))
        : null}
    </div>
  );
}
