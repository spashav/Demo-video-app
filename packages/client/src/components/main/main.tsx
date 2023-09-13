import styles from './main.module.css';

import { useApi } from '@demo-video-app/client/src/utils/use-api';
import { Card } from '@demo-video-app/client/src/components/card/card';

interface FeedItem {
  id: string;
  cover: string;
}
export function Main() {
  const related = useApi<FeedItem[]>({ apiUrl: `/feed` });

  return (
    <div className={styles.main}>
      {related.response
        ? related.response.map(({ id, cover }) => (
            <Card cover={cover} id={id} key={id} className={styles.card}/>
          ))
        : null}
    </div>
  );
}
