import styles from './swiper.module.css';
import '../../../../../node_modules/swiper/swiper.css';
import '../../../../../node_modules/swiper/modules/pagination.css';

import { Swiper as BaseSwiper, SwiperSlide } from 'swiper/react';
import { Mousewheel, Keyboard } from 'swiper/modules';
import * as moment from 'moment'
import * as _ from 'lodash';
import { Card } from '../card/card';
import { Swiper as SwiperClass } from 'swiper/types';
import { ReactComponent as OpenVideoIcon } from '../../assets/open-video.svg';

export function Swiper({
  onClick,
  onSwiper,
  items,
}: {
  onClick: (id: string) => void;
  onSwiper: (api: SwiperClass) => void;
  items: { id: string; cover: string; title: string; duration: number; genre: string }[];
}) {
  return (
    <BaseSwiper
      onSwiper={onSwiper}
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
      {_.map(items, ({ id, cover, genre, title, duration }) => (
        <SwiperSlide className={styles.swiperSlide} key={id}>
          <Card
            cover={cover}
            id={id}
            className={styles.card}
            onClick={onClick}
          />
          <div className={styles.centerCover}><OpenVideoIcon /></div>
          <div className={styles.bottomCover}>
            <div>{genre}</div>
            <div className={styles.bottomCoverCenterItem}>{title}</div>
            <div>{moment.utc(duration).format('HH:mm:ss')}</div>
          </div>
        </SwiperSlide>
      ))}
    </BaseSwiper>
  );
}
