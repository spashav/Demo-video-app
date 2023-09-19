import styles from './swiper.module.css';
import '../../../../../node_modules/swiper/swiper.css';
import '../../../../../node_modules/swiper/modules/pagination.css';

import { Swiper as BaseSwiper, SwiperSlide } from 'swiper/react';
import { Mousewheel, Keyboard } from 'swiper/modules';
import * as _ from 'lodash';
import cn from 'clsx';
import { useCallback, useState } from 'react';
import { Card } from '../card/card';
import { Swiper as SwiperClass } from 'swiper/types';
import { ReactComponent as OpenVideoIcon } from '../../assets/open-video.svg';
import { formatDuration } from '../../utils/format-duration';
import { useFlags } from '../../utils/use-flags';
import { Fake } from '../fake/fake';

export function Swiper({
  onClick,
  onSwiper,
  items,
  isLoading,
}: {
  onClick: (id: string) => void;
  onSwiper: (api: SwiperClass) => void;
  items: {
    id: string;
    cover: string;
    title: string;
    duration: number;
    genre: string;
  }[];
  isLoading: boolean;
}) {
  const { useFake } = useFlags();
  const [active, setActive] = useState(0);
  const handleSwiperApiInit = useCallback(
    (api: SwiperClass) => {
      api.on('slideChange', () => setActive(api.activeIndex));
      onSwiper(api);
    },
    [onSwiper]
  );

  if (isLoading && !useFake) {
    return null;
  }
  if (isLoading && useFake) {
    return (
      <div className={styles.fakeSwiper}>
        <Fake
          ratio={0.5022}
          className={styles.card}
          borderRadius={24}
        />
        <div className={styles.restFakeCards}>
          <Fake
            ratio={0.5022}
            className={styles.card}
            borderRadius={24}
          />
          <Fake
            ratio={0.5022}
            className={styles.card}
            borderRadius={24}
          />
        </div>
      </div>
    );
  }
  return (
    <BaseSwiper
      onSwiper={handleSwiperApiInit}
      slidesPerView={'auto'}
      direction={'vertical'}
      centeredSlides={true}
      mousewheel={true}
      keyboard={true}
      cssMode={true}
      spaceBetween={40}
      className={styles.swiper}
      modules={[Mousewheel, Keyboard]}
    >
      {_.map(items, ({ id, cover, genre, title, duration }, index) => {
        const isActive = active === index;
        return (
          <SwiperSlide className={styles.swiperSlide} key={id}>
            <Card
              ratio={0.5022}
              cover={cover}
              id={id}
              className={styles.card}
              onClick={onClick}
              withPreload={useFake}
            />
            {isActive && (
              <>
                <div className={styles.centerCover}>
                  <OpenVideoIcon />
                </div>
                <div className={styles.bottomCover}>
                  <div>{genre}</div>
                  <div className={styles.bottomCoverCenterItem}>{title}</div>
                  <div>{formatDuration(duration)}</div>
                </div>
              </>
            )}
            <div
              className={cn(
                styles.slideOverlay,
                isActive ? styles.isActive : null
              )}
            />
          </SwiperSlide>
        );
      })}
    </BaseSwiper>
  );
}
