import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectCoverflow, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

import style from "./CarouselSwiperPost.module.scss";

/**
 * CarouselSwiperPost
 * - Mostra un album di immagini con effetto coverflow
 * - Autoplay + paginazione cliccabile
 * - Usato nella pagina di dettaglio del Post
 */
export default function CarouselSwiperPost({ album }) {
  return (
    <Swiper
      effect="coverflow"
      grabCursor
      centeredSlides
      slidesPerView="auto"
      coverflowEffect={{
        rotate: 30,
        depth: 100,
        stretch: 0,
        modifier: 1,
        slideShadows: true,
      }}
      autoplay={{
        delay: 4000,
        disableOnInteraction: true,
      }}
      pagination={{ clickable: true }}
      modules={[EffectCoverflow, Pagination, Autoplay]}
      className={style.mySwiperPost}
    >
      {album.map((photo, index) => (
        <SwiperSlide key={index} className={style.slide}>
          <img src={photo} alt={`photo-${index}`} className={style.image} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
