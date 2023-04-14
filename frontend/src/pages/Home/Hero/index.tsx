import React from 'react';
import styles from './style.module.scss';

function index() {
    return (
        <>
            <section className={styles['hero']}>
                <div className={styles['hero__heading']}>
                    <p> Build a professional</p>
                    <p> CV for free </p>
                </div>
                <div className={styles['hero__banner']}></div>
            </section>
        </>
    );
}

export default index;
