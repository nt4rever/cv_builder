import { useEffect, useState } from 'react';
import clsx from 'clsx';
import styles from './index.module.scss';
import { useDispatch } from 'react-redux';
import { editAction } from 'redux/EditCV/slice';
import useDebounce from 'hooks/useDebounce';

interface SectionProps {
    heading: string;
    sectionId: string;
    editHeading?: boolean;
    children?: React.ReactNode;
}

const SectionContainer = ({ sectionId, children, heading, editHeading = false }: SectionProps) => {
    const [isEdit, setIsEdit] = useState(false);
    const [headingValue, setHeadingValue] = useState(heading);
    const debounceValue = useDebounce(headingValue, 1000);
    const dispatch = useDispatch();

    useEffect(() => {
        if (headingValue)
            dispatch(
                editAction.editHeading({
                    sectionId,
                    heading: headingValue,
                }),
            );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debounceValue]);

    const handleEditHeading = (event: React.ChangeEvent<HTMLInputElement>) => {
        setHeadingValue(event.target.value);
    };

    const handleDelete = () => {
        dispatch(editAction.deleteSection({ sectionId }));
    };

    return (
        <div className={styles.root}>
            <div className={styles.headingContainer}>
                <input
                    onBlur={() => setIsEdit(false)}
                    type="text"
                    value={headingValue}
                    onChange={handleEditHeading}
                    disabled={!isEdit}
                    className={clsx(styles.headingInput, { [styles.editable]: isEdit })}
                />
                {editHeading && (
                    <div className={styles.headingAction} style={{ display: isEdit ? 'none' : 'flex' }}>
                        <button onClick={() => setIsEdit(true)}>
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 20 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M15 0L12.5 2.5L17.5 7.5L20 5L15 0ZM10 5L0 15V20H5L15 10L10 5Z"
                                    fill="#D9D9D9"
                                />
                            </svg>
                        </button>
                        <button onClick={handleDelete}>
                            <svg
                                width="20"
                                height="23"
                                viewBox="0 0 20 23"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M8.57143 0C7 0 5.71429 1.28571 5.71429 2.85714H2.85714C1.28571 2.85714 0 4.14286 0 5.71429H20C20 4.14286 18.7143 2.85714 17.1429 2.85714H14.2857C14.2857 1.28571 13 0 11.4286 0H8.57143ZM2.85714 8.57143V22.3143C2.85714 22.6286 3.08571 22.8571 3.4 22.8571H16.6286C16.9429 22.8571 17.1714 22.6286 17.1714 22.3143V8.57143H14.3143V18.5714C14.3143 19.3714 13.6857 20 12.8857 20C12.0857 20 11.4571 19.3714 11.4571 18.5714V8.57143H8.6V18.5714C8.6 19.3714 7.97143 20 7.17143 20C6.37143 20 5.74286 19.3714 5.74286 18.5714V8.57143H2.88571H2.85714Z"
                                    fill="#D9D9D9"
                                />
                            </svg>
                        </button>
                    </div>
                )}
            </div>
            <div className={styles.container}>{children}</div>
        </div>
    );
};

export default SectionContainer;
