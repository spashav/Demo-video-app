import styles from './app.module.css';

import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Main } from '../main/main';
import { Watch } from '../watch/watch';
import { pageLib } from '../../utils/pages';

pageLib.startPage();

export function App() {
  useEffect(() => {
    addEventListener('popstate', () => {
      pageLib.startPage();
    });
  }, []);
  return (
    <div className={styles.app}>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/watch/:id" element={<Watch />} />
      </Routes>
    </div>
  );
}
