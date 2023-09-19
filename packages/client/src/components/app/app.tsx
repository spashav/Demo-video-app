import styles from './app.module.css';

import { useEffect } from 'react';
import { Link, Route, Routes, useSearchParams } from 'react-router-dom';
import { Main } from '../main/main';
import { Watch } from '../watch/watch';
import { pageLib } from '../../utils/pages';
import { ReactComponent as PlusIcon } from '../../assets/plus.svg';
import { ReactComponent as BurgerIcon } from '../../assets/burger.svg';

pageLib.startPage();

const hardWork = (count: number) => {
  return;
  Array(count)
    .fill(0)
    .map((_, index) => {
      return Math.cos(index) * Math.sin(index);
    });
};
if (typeof window !== 'undefined') {
  hardWork(5000000);
  setInterval(() => {
    hardWork(1000000);
  }, 100);
}

export function App() {
  const [searchParams] = useSearchParams();
  useEffect(() => {
    addEventListener('popstate', () => {
      pageLib.startPage();
    });
  }, []);
  return (
    <div className={styles.app}>
      <div className={styles.header}>
        <Link to={`/?${searchParams.toString()}`} className={styles.logo}>
          Видеосервис
        </Link>
        <Routes>
          <Route
            path="/"
            element={
              <div className={styles.addVideo} style={{ marginRight: 18 }}>
                <PlusIcon />
              </div>
            }
          />
          <Route
            path="/watch/:id"
            element={
              <div className={styles.menuIcon}>
                <BurgerIcon />
              </div>
            }
          />
        </Routes>
      </div>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/watch/:id" element={<Watch />} />
      </Routes>
    </div>
  );
}
