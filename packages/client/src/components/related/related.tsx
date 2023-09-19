import styles from './related.module.css';

import cn from 'clsx';

import { useApi } from '../../utils/use-api';
import { Card } from '../card/card';

interface RelatedItem {
  id: string;
  cover: string;
}
export function Related({ id, className, onClick }: { id: string; className: string, onClick: (id: string) => void }) {
  const related = useApi<RelatedItem[]>({ apiUrl: `/related?id=${id}` });

  return (
    <div className={cn(className, styles.related)}>
      <div className={styles.title}>Рекомендации</div>
      {related.response
        ? related.response.map(({ id, cover }) => (
            <Card cover={cover} id={id} key={id} className={styles.card} onClick={onClick} ratio={0.6122}/>
          ))
        : null}
    </div>
  );
}
