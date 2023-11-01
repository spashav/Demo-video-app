import styles from './app.module.css';

import { useEffect, useState } from 'react';
import { Link, Route, Routes, useSearchParams } from 'react-router-dom';
import { Main } from '../main/main';
import { Watch } from '../watch/watch';
import { ReactComponent as PlusIcon } from '../../assets/plus.svg';
import { ReactComponent as BurgerIcon } from '../../assets/burger.svg';
import { getGlobalLib } from '../../utils/get-global-lib';

const hardWork = (count: number) => {
  Array(count)
    .fill(0)
    .map((_, index) => {
      return Math.cos(index) * Math.sin(index);
    });
};
if (typeof window !== 'undefined') {
  // Большая лонгтаска на старте
  hardWork(5000000);
  setInterval(() => {
    // Небольшие лонгтаски во время работы
    hardWork(800000);
  }, 200);
}

export function App() {
  const [searchParams] = useSearchParams();
  const [globalLib] = useState(() => getGlobalLib());
  useEffect(() => {
    globalLib.getPageLib().startFirstPage();
  }, []);
  useEffect(() => {
    addEventListener('popstate', () => {
      globalLib.getPageLib().startPage();
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
        <Route path="/" element={<Main globalLib={globalLib} />} />
        <Route path="/watch/:id" element={<Watch globalLib={globalLib} />} />
      </Routes>
    </div>
  );
}
