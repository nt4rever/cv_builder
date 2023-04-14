import React from 'react';
import './style.scss';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper';
import 'swiper/css';
import carouselDatas from '../../../data/carouseldata.json';

const Carousel = () => {
    return (
        <>
            <Swiper
                slidesPerView={1}
                autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                }}
                breakpoints={{
                    300: {
                        slidesPerView: 2,
                        spaceBetween: 20,
                    },
                    449: {
                        slidesPerView: 2,
                        spaceBetween: 20,
                    },
                    640: {
                        slidesPerView: 2,
                    },
                    768: {
                        slidesPerView: 2,
                    },
                    874: {
                        slidesPerView: 3,
                        spaceBetween: 10,
                    },
                    900: {
                        slidesPerView: 3,
                    },
                    1024: {
                        slidesPerView: 3,
                    },
                    1200: {
                        slidesPerView: 4,
                    },
                }}
                modules={[Autoplay]}
                className="mySwiper"
            >
                <div className="examples">
                    {carouselDatas.map((carouselData) => (
                        <SwiperSlide className="examples__list" key={carouselData.id}>
                            <div className="examples__list--img">
                                <img src={carouselData.img} alt="" />
                            </div>
                        </SwiperSlide>
                    ))}
                </div>
            </Swiper>
        </>
    );
};
export default Carousel;
