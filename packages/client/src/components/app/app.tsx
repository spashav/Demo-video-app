import styles from './app.module.css';

import { Route, Routes, Link } from 'react-router-dom';
import { Main } from '../main/main';
import { Watch } from '../watch/watch';
import { Player } from '../player/player';

export function App() {
  return (
    <div className={styles.app}>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/watch/:id" element={<Watch id={'1'} />} />
        <Route
          path="/player/:version/:id"
          element={<Player id={'1'} version={'1.1'} />}
        />
      </Routes>
    </div>
  );
}
