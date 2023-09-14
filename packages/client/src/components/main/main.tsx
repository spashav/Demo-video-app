import styles from './main.module.css';

import { useCallback } from 'react';
import { useApi } from '../../utils/use-api';
import { Card } from '../card/card';
import { pageLib } from '../../utils/pages';

interface FeedItem {
  id: string;
  cover: string;
}
export function Main() {
  const related = useApi<FeedItem[]>({ apiUrl: `/feed` });
  const handleItemClick = useCallback(() => {
    pageLib.startPage();
  }, []);

  return (
    <div className={styles.main}>
      {related.response
        ? related.response.map(({ id, cover }) => (
            <Card
              cover={cover}
              id={id}
              key={id}
              className={styles.card}
              onClick={handleItemClick}
            />
          ))
        : null}
    </div>
  );
}
