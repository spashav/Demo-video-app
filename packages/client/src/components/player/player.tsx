import styles from './player.module.css';

import { Link } from 'react-router-dom';

export function Player({ id, version }: { id: string; version: string }) {
  return (
    <div className={styles.player}>
      {`This is player with version "${version}" and video "${id}" route.`}
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
