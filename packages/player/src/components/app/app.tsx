import { Route, Routes } from 'react-router-dom';
import { PlayerIframe } from '../player-iframe/player-iframe';

import styles from './app.module.css'

export function App() {
  return (
    <div className={styles.app}>
      <Routes>
        <Route
          path="/player/:version/:id"
          element={<PlayerIframe />}
        />
      </Routes>
    </div>
  );
}
