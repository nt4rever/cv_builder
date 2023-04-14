import React from 'react';
import styles from './style.module.scss';
import AngleNext from '@/assets/img/svg/angleNext.svg';
import CheckDone from '@/assets/img/svg/checkDone.svg';

interface ItemProps {
    type: string;
    content: string;
}

interface IProps {
    stepNumber: number;
}

function BreadItem({ type, content }: ItemProps) {
    const renderitem = () => {
        switch (type) {
            case 'progress':
                return <p className={`${styles['bread__item']} ${styles['bread__item--progress']}`}>{content}</p>;
        }
    };
    return <>{renderitem()}</>;
}

function index({ stepNumber }: IProps) {
    const breadList = ['Work', 'Education', 'About', 'Contact'];
    return (
        <>
            <div className={styles['bread']}>
                {breadList.map(
                    (item, index) =>
                        index + 1 === stepNumber && (
                            <p className={`${styles['bread__item']} ${styles['bread__item--progress']}`}>{item}</p>
                        ),
                )}
            </div>
        </>
    );
}

export default index;
