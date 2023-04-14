import React from 'react';
import { Link } from 'react-router-dom';
import styles from './style.module.scss';
import clsx from 'clsx';
import arrow from '@/assets/img/svg/arrow.svg';
import { useSelector } from 'react-redux';

const stepList = [
    {
        index: 1,
        title: 'Signup',
        desc: 'Create an account to try it for free',
        color: 'rgb(44, 229, 174)',
    },
    {
        index: 2,
        title: 'Choose a template',
        desc: '12 Hiring manager approved templates',
        color: 'rgb(65, 209, 255)',
    },
    {
        index: 3,
        title: 'Share as PNG or PDF',
        desc: 'A resume for every application',
        color: 'rgb(244, 114, 255)',
    },
];

function StepWorks() {
    const currentAccount = useSelector((state: any) => state?.user?.currentUser);

    return (
        <>
            <section className={styles['step']}>
                <p className="page__gloss">HOW IT WORKS</p>
                <p className="page__title">3 Steps. 5 Minute.</p>
                <ul className={styles['step__list']}>
                    {stepList.map((step) => (
                        <li className={styles['step__item']}>
                            <span
                                style={{
                                    border: `1px solid ${step.color}`,
                                    color: `${step.color}`,
                                }}
                            >
                                {step.index}
                            </span>
                            <div className={styles['step__content']}>
                                <div>{step.title}</div>
                                <p>{step.desc}</p>
                            </div>
                        </li>
                    ))}
                </ul>
                {!currentAccount ? (
                    <Link to="/login">
                        <button className={clsx(styles['step__button'], 'button button--primary')}>
                            Build My CV
                            <img src={arrow} alt=""></img>
                        </button>
                    </Link>
                ) : (
                    <Link to="/add-cv">
                        <button className={clsx(styles['step__button'], 'button button--primary')}>
                            Build My CV
                            <img src={arrow} alt=""></img>
                        </button>
                    </Link>
                )}
            </section>
        </>
    );
}

export default StepWorks;
