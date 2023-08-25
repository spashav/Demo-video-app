import styles from './player.module.css';

import { Link } from 'react-router-dom';

export function Player({ id, version }: { id: string; version: string }) {
  return (
    <div className={styles.player}>
      {`This is player iframe with version "${version}" and video "${id}" route.`}
    </div>
  );
}
