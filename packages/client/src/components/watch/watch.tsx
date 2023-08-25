import styles from './watch.module.css';

import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { getPlayerPublicApi } from '../../player/public-api';

const CONTAINER_ID = '#player';

export function Watch({ id }: { id: string }) {
  useEffect(() => {
    getPlayerPublicApi().iframe.setSource({
      id,
      container: CONTAINER_ID,
    });
  }, []);

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
