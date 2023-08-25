import styles from './main.module.css';

import { Link } from 'react-router-dom';

export function Main() {
  return (
    <div className={styles.main}>
      This is Main route.
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

