import styles from './main.module.css';

import { useCallback } from 'react';
import * as _ from 'lodash';
import { useApi } from '../../utils/use-api';
import { Card } from '../card/card';
import { pageLib } from '../../utils/pages';
import { logMetric } from '../../utils/log-metric';

interface FeedItem {
  id: string;
  cover: string;
}
export function Main() {
  const related = useApi<FeedItem[]>({ apiUrl: `/feed` });
  const handleItemClick = useCallback((id: string) => {
    logMetric('Click related', id);
    pageLib.startPage();
  }, []);

  return (
    <div className={styles.main}>
      {related.response
        ? _.map(related.response, ({ id, cover }) => (
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
