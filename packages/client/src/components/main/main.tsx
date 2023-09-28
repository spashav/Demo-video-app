import styles from './main.module.css';

import { useCallback, useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import cn from 'clsx';
import { Swiper as SwiperClass } from 'swiper/types';
import { VideoSource } from '@demo-video-app/player/src/public-api';
import { useApi } from '../../utils/use-api';
import { Swiper } from '../swiper/swiper';
import { useFlags } from '../../utils/use-flags';
import { useVideoSourceCache } from '../../utils/api-cache';
import { GlobalLib } from '../../types/global-lib';

import { ReactComponent as Icon1 } from '../../assets/nav-1.svg';
import { ReactComponent as Icon2 } from '../../assets/nav-2.svg';
import { ReactComponent as Icon3 } from '../../assets/nav-3.svg';
import { ReactComponent as Icon4 } from '../../assets/nav-4.svg';
import { ReactComponent as NextArrowIcon } from '../../assets/next-arrow.svg';
import { ReactComponent as PrevArrowIcon } from '../../assets/prev-arrow.svg';

interface FeedItem {
  id: string;
  cover: string;
  title: string;
  genre: string;
  duration: number;
  playerConfig?: VideoSource;
}
export function Main({ globalLib }: { globalLib: GlobalLib }) {
  const { usePreloadAndDelayedRelated, disableIframe } = useFlags();
  const videoSourceCache = useVideoSourceCache()
  const [searchParams] = useSearchParams();
  const linkToMain = `/?${searchParams.toString()}`;
  const related = useApi<FeedItem[]>({ apiUrl: `/feed` });
  const [swiperApi, setSwiperApi] = useState<SwiperClass>();

  useEffect(() => {
    if (usePreloadAndDelayedRelated) {
      globalLib.getPlayerLib().preloadResources({ disableIframe });
    }
  }, [usePreloadAndDelayedRelated, globalLib]);

  const handleItemClick = useCallback((id: string) => {
    globalLib.logMetric('Click related', id);
    globalLib.getPageLib().startPage();
  }, []);
  useEffect(() => {
    related.response?.forEach(
      ({ id, playerConfig }) =>
        playerConfig && videoSourceCache.set(id, playerConfig)
    );
  }, [related.response]);
  const handleArrowsClick = (direction: 'prev' | 'next') => {
    if (!swiperApi) {
      return;
    }
    direction === 'next' ? swiperApi.slideNext() : swiperApi.slidePrev();
  };

  return (
    <div className={styles.main}>
      <div className={styles.left}>
        <div className={styles.leftWrap}>
          <ul className={styles.nav}>
            <li className={cn(styles.navItem, styles.isActive)}>
              <Link to={linkToMain}>
                <Icon1 className={styles.navIcon} />
                Главная
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link to={linkToMain}>
                <Icon2 className={styles.navIcon} />
                Рекомендации
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link to={linkToMain}>
                <Icon3 className={styles.navIcon} />
                Популярное
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link to={linkToMain}>
                <Icon4 className={styles.navIcon} />О сервисе
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className={styles.feed}>
        <Swiper
          items={related.response || []}
          onClick={handleItemClick}
          onSwiper={setSwiperApi}
          isLoading={related.isLoading}
        />
      </div>
      <div className={styles.right}>
        <div className={styles.arrows}>
          <div
            className={styles.prevArrow}
            onClick={() => handleArrowsClick('prev')}
          >
            <PrevArrowIcon style={{ marginTop: 27 }} />
          </div>
          <div
            className={styles.nextArrow}
            onClick={() => handleArrowsClick('next')}
          >
            <NextArrowIcon style={{ marginTop: 29 }} />
          </div>
        </div>
      </div>
    </div>
  );
}
