import styles from './watch.module.css';

import { useParams } from 'react-router-dom';
import { Player } from '../player/player';
import { Related } from '../related/related';
import { FullInfo } from '../full-info/full-info';

export function Watch() {
  const { id } = useParams();
  if (!id) {
    return <div className={styles.watch}>Empty id in url</div>;
  }
  return (
    <div className={styles.watch}>
      <div className={styles.main}>
        <Player id={id} className={styles.player} />
        <FullInfo id={id} className={styles.description} />
      </div>
      <Related id={id} className={styles.related} />
    </div>
  );
}
