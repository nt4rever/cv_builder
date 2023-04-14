import { Detail as IDetail } from 'utils/types';
import { ChangeEvent, FC, useEffect, useState } from 'react';
import styles from './index.module.scss';
import useDebounce from 'hooks/useDebounce';
import { useDispatch } from 'react-redux';
import { editAction } from 'redux/EditCV/slice';
import * as Yup from 'yup';
import clsx from 'clsx';
interface DetailProps {
    sectionId: string;
    data: IDetail;
}

type TempKeys = 'title' | 'subTitle';

const Detail: FC<DetailProps> = (props) => {
    const [values, setValues] = useState(props.data);
    const dispatch = useDispatch();
    const valuesDebounce = useDebounce(values, 1000);
    const [validateField, setValidateField] = useState({
        title: true,
        subTitle: true,
    });

    const detailSchema = Yup.object().shape({
        title: Yup.string().max(100),
        subTitle: Yup.string().max(1000),
    });

    useEffect(() => {
        detailSchema
            .validate(valuesDebounce, { abortEarly: false })
            .then((value) => {
                setValidateField({
                    title: true,
                    subTitle: true,
                });
                dispatch(
                    editAction.editDetail({
                        sectionId: props.sectionId,
                        detail: valuesDebounce,
                    }),
                );
            })
            .catch((error) => {
                const temp = {
                    ...validateField,
                };
                error.inner.forEach((err: any) => {
                    const path = err.path as TempKeys;
                    temp[path] = false;
                });
                // setValidateField(temp);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [valuesDebounce]);

    const handleDelete = () => {
        dispatch(
            editAction.deleteDetail({
                sectionId: props.sectionId,
                detailId: props.data.id,
            }),
        );
    };

    return (
        <div className={styles.root}>
            <div className={styles.action}>
                <button onClick={handleDelete}>
                    <svg width="20" height="23" viewBox="0 0 20 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M8.57143 0C7 0 5.71429 1.28571 5.71429 2.85714H2.85714C1.28571 2.85714 0 4.14286 0 5.71429H20C20 4.14286 18.7143 2.85714 17.1429 2.85714H14.2857C14.2857 1.28571 13 0 11.4286 0H8.57143ZM2.85714 8.57143V22.3143C2.85714 22.6286 3.08571 22.8571 3.4 22.8571H16.6286C16.9429 22.8571 17.1714 22.6286 17.1714 22.3143V8.57143H14.3143V18.5714C14.3143 19.3714 13.6857 20 12.8857 20C12.0857 20 11.4571 19.3714 11.4571 18.5714V8.57143H8.6V18.5714C8.6 19.3714 7.97143 20 7.17143 20C6.37143 20 5.74286 19.3714 5.74286 18.5714V8.57143H2.88571H2.85714Z"
                            fill="#D9D9D9"
                        />
                    </svg>
                </button>
            </div>
            <div className={styles.container}>
                <div
                    className={clsx(styles.title, {
                        invalid: !validateField.title,
                    })}
                >
                    <input
                        type="text"
                        value={values.title}
                        placeholder="Title"
                        onChange={(event: ChangeEvent<HTMLInputElement>) => {
                            setValues({
                                ...values,
                                title: event.target.value,
                            });
                        }}
                    />
                </div>
                <div
                    className={clsx(styles.subTitle, {
                        invalid: !validateField.subTitle,
                    })}
                >
                    <textarea
                        placeholder="Subtitle"
                        value={values.subTitle}
                        onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
                            setValues({
                                ...values,
                                subTitle: event.target.value,
                            });
                        }}
                    ></textarea>
                </div>
            </div>
        </div>
    );
};

export default Detail;
