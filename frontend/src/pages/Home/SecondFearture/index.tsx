import React from 'react';
import { Link } from 'react-router-dom';

import styles from './style.module.scss';
import clsx from 'clsx';
import arrow from '@/assets/img/svg/arrow.svg';
import auto from '@/assets/img/svg/auto.svg';
import customize from '@/assets/img/svg/customize.svg';
import best from '@/assets/img/svg/best.svg';
import { useSelector } from 'react-redux';

function SecondFearture() {
    const currentAccount = useSelector((state: any) => state?.user?.currentUser);

    return (
        <>
            <section className={styles['fearture']}>
                <p className="page__gloss">CV Builder</p>
                <h2 className="page__title">Dead Simple</h2>
                <p className={styles['fearture__desc']}>
                    Creating a resume that follows best practices and impresses hiring managers has never been easier.
                </p>
                <div className={styles['fearture__box']}>
                    <ul className={styles['fearture__list']}>
                        <li className={styles['fearture__item']}>
                            <div>
                                <img src={auto} alt=""></img>
                            </div>
                            <p>Automatic formatting</p>
                        </li>
                        <li className={clsx(styles['fearture__item'], styles['fearture__item--active'])}>
                            <div>
                                <img src={customize} alt=""></img>
                            </div>
                            <p>Change & customize templates</p>
                        </li>
                        <li className={styles['fearture__item']}>
                            <div>
                                <img src={best} alt=""></img>
                            </div>
                            <p>Built in best practices</p>
                        </li>
                    </ul>
                    {!currentAccount ? (
                        <Link to="/login">
                            <button className={styles['fearture__button']}>
                                Build My CV
                                <img src={arrow} alt=""></img>
                            </button>
                        </Link>
                    ) : (
                        <Link to="/add-cv">
                            <button className={styles['fearture__button']}>
                                Build My CV
                                <img src={arrow} alt=""></img>
                            </button>
                        </Link>
                    )}

                    <img alt="" src={require('@/assets/img/fearture2.png')}></img>
                </div>
            </section>
        </>
    );
}

export default SecondFearture;
