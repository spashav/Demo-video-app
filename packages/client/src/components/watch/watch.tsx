import styles from './watch.module.css';

import { Link, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { getPlayerPublicApi } from '@demo-video-app/player/src/public-api';

const CONTAINER_ID = '#player';

export function Watch() {
  const { id } = useParams();
  useEffect(() => {
    if (!id) {
      return;
    }
    getPlayerPublicApi().iframe.setSource({
      id,
      container: CONTAINER_ID,
    });
  }, []);

  if (!id) {
    return <div className={styles.watch}>Empty id in url</div>;
  }

  return (
    <div className={styles.watch}>
      {`This is watch video "${id}" route.`}
      <div className={styles.playerCont}>
        <div className={styles.player} id={CONTAINER_ID}></div>
      </div>
      <div role="navigation">
        <ul>
          <li>
            <Link to="/">Main</Link>
          </li>
          <li>
            <Link to="/watch/1">Watch</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
