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
            case 'default':
                return <p className={`${styles['bread__item']}`}>{content}</p>;
            case 'progress':
                return <p className={`${styles['bread__item']} ${styles['bread__item--progress']}`}>{content}</p>;
            case 'done':
                return (
                    <p className={`${styles['bread__item']} ${styles['bread__item--done']}`}>
                        <img src={CheckDone}></img>
                        {content}
                    </p>
                );
        }
    };
    return <>{renderitem()}</>;
}

function index({ stepNumber }: IProps) {
    const breadList = ['Work', 'Education', 'About', 'Contact'];
    return (
        <>
            <div className={styles['bread']}>
                {breadList.map((item, index) => {
                    if (index + 1 === stepNumber) {
                        return (
                            <>
                                <BreadItem type={'progress'} content={item}></BreadItem>
                                {index !== 3 && <img src={AngleNext}></img>}
                            </>
                        );
                    } else if (index + 1 < stepNumber) {
                        return (
                            <>
                                <BreadItem type={'done'} content={item}></BreadItem>
                                {index !== 3 && <img src={AngleNext}></img>}
                            </>
                        );
                    } else {
                        return (
                            <>
                                <BreadItem type={'default'} content={item}></BreadItem>
                                {index !== 3 && <img src={AngleNext}></img>}
                            </>
                        );
                    }
                })}
            </div>
        </>
    );
}

export default index;
