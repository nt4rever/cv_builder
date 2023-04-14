import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './style.module.scss';
import arrow from '@/assets/img/svg/arrow.svg';
import creative from '@/assets/img/creative-img.webp';
import modern from '@/assets/img/modern-img.webp';
import professional from '@/assets/img/professional-img.webp';
import simple from '@/assets/img/simple-img.webp';

function Index() {
    const [isActive, setIsActive] = React.useState<boolean>(false);
    const [color, setColor] = useState('#A572E7');
    const [imageClicked, setImageClicked] = useState({
        creative: true,
        modern: false,
        professional: false,
        simple: false,
    });
    const onClickHandler = (order: string) => {
        setIsActive(true);

        const resetImages = {
            creative: false,
            modern: false,
            professional: false,
            simple: false,
        };

        setImageClicked({
            ...resetImages,
            [order]: true,
        });
    };

    useEffect(() => {
        if (imageClicked.creative === true) {
            setColor('#A572E7');
        } else if (imageClicked.modern === true) {
            setColor('#7828ED');
        } else if (imageClicked.professional === true) {
            setColor('#194081');
        } else {
            setColor('#3554F2');
        }
    }, [imageClicked]);
    return (
        <>
            <section className={styles['fearture']}>
                <p className="page__gloss">Optimized Designs</p>
                <h2 className="page__title">Designed for Success</h2>
                <p className={styles['fearture__desc']}>Choose from12 uniquely designed resume templates.</p>
                <div style={{ backgroundColor: color }} className={styles['fearture__box']}>
                    <ul className={styles['fearture__list']}>
                        <li
                            className={`${styles['fearture__item']} ${
                                imageClicked.creative ? styles['image__active'] : ''
                            }`}
                        >
                            <button onClick={() => onClickHandler('creative')} className="imageClick">
                                Creative
                            </button>
                        </li>
                        <li
                            className={`${styles['fearture__item']} ${
                                imageClicked.modern ? styles['image__active'] : ''
                            }`}
                        >
                            <button onClick={() => onClickHandler('modern')} className="imageClick">
                                Modern
                            </button>
                        </li>
                        <li
                            className={`${styles['fearture__item']} ${
                                imageClicked.professional ? styles['image__active'] : ''
                            }`}
                        >
                            <button onClick={() => onClickHandler('professional')} className="imageClick">
                                Professional
                            </button>
                        </li>
                        <li
                            className={`${styles['fearture__item']} ${
                                imageClicked.simple ? styles['image__active'] : ''
                            }`}
                        >
                            <button onClick={() => onClickHandler('simple')} className="imageClick">
                                Simple
                            </button>
                        </li>
                    </ul>
                    <Link to="/template">
                        <button className={styles['fearture__button']}>
                            Use This Template
                            <img src={arrow} alt=""></img>
                        </button>
                    </Link>
                    {imageClicked.creative && <img src={creative} alt="imageClick" />}
                    {imageClicked.modern && <img src={modern} alt="imageClick" />}
                    {imageClicked.professional && <img src={professional} alt="imageClick" />}
                    {imageClicked.simple && <img src={simple} alt="imageClick" />}
                </div>
            </section>
        </>
    );
}

export default Index;
