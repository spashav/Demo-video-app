import styles from './app.module.css';

import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Main } from '../main/main';
import { Watch } from '../watch/watch';
import { pageLib } from '../../utils/pages';

pageLib.startPage();

const hardWork = (count: number) => {
  const a = performance.now()
  Array(count).fill(0).map((_, index) => {
    return Math.cos(index) * Math.sin(index)
  })
}
if (typeof window !== 'undefined') {
  hardWork(5000000)
  setInterval(() => {
    hardWork(1000000)
  }, 100)
}

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
