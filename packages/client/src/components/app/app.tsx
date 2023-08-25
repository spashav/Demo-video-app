import styles from './app.module.css';

import { Route, Routes } from 'react-router-dom';
import { Main } from '../main/main';
import { Watch } from '../watch/watch';

export function App() {
  return (
    <div className={styles.app}>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/watch/:id" element={<Watch id={'1'} />} />
      </Routes>
    </div>
  );
}
