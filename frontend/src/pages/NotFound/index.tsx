import React from 'react';
import Header from 'components/Header/Header';
import styles from './style.module.scss';
import clsx from 'clsx';
import { Link } from 'react-router-dom';

function index() {
    return (
        <>
            <div className={clsx(styles['notfound'], 'wrapper')}>
                <Header></Header>
                <div className="container">
                    <div className={styles['notfound__content']}>
                        <p className={styles['notfound__heading']}>Hmmm...</p>
                        <p className={styles['notfound__desc']}>
                            Sorry, we coudln't find what <br></br>you were looking for.
                        </p>
                        <Link to={'/home'} className={styles['notfound__link']}>Back to Homepage</Link>
                    </div>
                </div>
            </div>
        </>
    );
}

export default index;
