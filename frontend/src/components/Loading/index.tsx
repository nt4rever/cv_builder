import React from 'react';
import styles from './style.module.scss';

function Loading() {
    return (
        <div className={styles["loading"]}>
            <div className={styles["loading__ring"]}>
                Loading
                <span></span>
            </div>
        </div>
    );
}

export default Loading;
