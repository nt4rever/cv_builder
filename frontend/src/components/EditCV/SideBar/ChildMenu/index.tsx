import React from 'react';
import { Section } from 'utils/types';
import styles from '../index.module.scss';

interface IProps {
    data: Section;
}

const ChildMenu: React.FC<IProps> = ({ data }) => {
    return (
        <>
            {data.type === 'STANDARD' && data.standards.length > 0 ? (
                <div className={styles.childrenContainer}>
                    {data.standards.map((childItem) => (
                        <div className={styles.childItem} key={childItem.id}>
                            <p>{childItem.name ? childItem.name : 'untitled'}</p>
                        </div>
                    ))}
                </div>
            ) : data.type === 'DETAIL' && data.details.length > 0 ? (
                <div className={styles.childrenContainer}>
                    {data.details.map((childItem) => (
                        <div className={styles.childItem} key={childItem.id}>
                            <p>{childItem.title ? childItem.title : 'untitled'}</p>
                        </div>
                    ))}
                </div>
            ) : null}
        </>
    );
};

export default ChildMenu;
