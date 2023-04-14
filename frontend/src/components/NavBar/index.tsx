import React, { useState, useEffect } from 'react';
import Logo from '@/assets/img/logoNav.png';
import Breadcrumbs from './Breadcrumbs';
import BreadMobile from './BreadMobile';
import BackArrow from '@/assets/img/svg/backArrow.svg';
import styles from './style.module.scss';
import MobileArrow from '@/assets/img/svg/mobileArrow.svg';
import { Link } from 'react-router-dom';

interface IProps {
    activeStep: number;
    setActiveStep: React.Dispatch<React.SetStateAction<number>>;
    handleBack: () => void;
}

function Index({ activeStep, setActiveStep, handleBack }: IProps) {
    const [stepNumber, setStepNumber] = useState(1);
    useEffect(() => {
        setStepNumber(activeStep);
    });
    return (
        <>
            <div className={styles['nav']}>
                <div>
                    <a href="/">
                        <img src={Logo} alt="" className={styles['nav__logo']} />
                    </a>
                </div>
                {stepNumber === 1 ? (
                    <Link to={'/home'}>
                        <button className={styles['nav__back']}>
                            <img src={MobileArrow}></img>
                        </button>
                    </Link>
                ) : (
                    <button className={styles['nav__back']} onClick={() => setActiveStep((pre) => pre - 1)}>
                        <img src={MobileArrow}></img>
                    </button>
                )}
                <Breadcrumbs stepNumber={stepNumber}></Breadcrumbs>
                <BreadMobile stepNumber={stepNumber}></BreadMobile>
                {stepNumber <= 1 ? (
                    <div></div>
                ) : (
                    <button
                        className={styles['nav__button']}
                        onClick={() => {
                            handleBack();
                            setActiveStep((pre) => pre - 1);
                        }}
                    >
                        <img src={BackArrow} alt="" />
                        Back
                    </button>
                )}
            </div>
        </>
    );
}

export default Index;
