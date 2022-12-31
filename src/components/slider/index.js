import React from "react";
import { SliderContainer } from "./style";
import { Pagination, Autoplay } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";

function Slider(props) {
  const { bannerList } = props;

  return (
    <div>
      <SliderContainer>
        <div className="before"></div>
        <div className="slider-container">
          <div className="swiper-wrapper">
            <Swiper
              // install Swiper modules
              modules={[Pagination, Autoplay]}
              spaceBetween={10}
              slidesPerView={1}
              loop
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
              }}
              // 气泡
              pagination={{ el: ".swiper-pagination", clickable: true }}
            >
              {bannerList.map((item, index) => (
                <SwiperSlide key={index}>
                    <img
                      src={item.imageUrl}
                      alt="推荐"
                      width="100%"
                      height="100%"
                    />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
          <div className="swiper-pagination"></div>
        </div>
      </SliderContainer>
    </div>
  );
}
export default React.memo(Slider);