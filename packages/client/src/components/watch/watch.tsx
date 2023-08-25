import styles from './watch.module.css';

import { Link } from 'react-router-dom';

export function Watch({ id }: { id: string }) {
  return (
    <div className={styles.watch}>
      {`This is watch video "${id}" route.`}
      <div role="navigation">
        <ul>
          <li>
            <Link to="/">Main</Link>
          </li>
          <li>
            <Link to="/watch/1">Watch</Link>
          </li>
          <li>
            <Link to="/player/1.1/1">Player</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
