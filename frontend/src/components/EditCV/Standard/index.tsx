import { MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { Standard as IStandard } from '../../../utils/types';
import styles from './index.module.scss';
import RichTextExample from 'components/Slate';
import { ChangeEvent, FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { editAction } from 'redux/EditCV/slice';
import * as Yup from 'yup';
import clsx from 'clsx';
import useDebounce from 'hooks/useDebounce';

interface StandardProps {
    sectionId: string;
    data: IStandard;
}
type TempKeys = 'id' | 'name' | 'title' | 'description' | 'website' | 'start' | 'stop' | 'order';

const Standard: FC<StandardProps> = ({ data, sectionId }) => {
    const [values, setValues] = useState(data);
    const debounceValues: IStandard = useDebounce(values, 500);
    const setTimeStart = (value: string) => {
        if (values.stop) {
            const dStart = new Date(value);
            const dStop = new Date(values.stop);
            const dNow = new Date();
            if (dStart <= dStop && dStart <= dNow)
                setValues({
                    ...values,
                    start: value,
                });
        } else
            setValues({
                ...values,
                start: value,
            });
    };
    const setTimeStop = (value: string) => {
        if (values.start) {
            const dStart = new Date(values.start);
            const dStop = new Date(value);
            if (dStart <= dStop)
                setValues({
                    ...values,
                    stop: value,
                });
        } else
            setValues({
                ...values,
                stop: value,
            });
    };

    const setCurrentChecked = (value: boolean) => {
        setValues({
            ...values,
            current: value,
            stop: value ? new Date().toISOString() : values.stop,
        });
    };

    const dispatch = useDispatch();
    const [validateField, setValidateField] = useState({
        id: true,
        name: true,
        title: true,
        description: true,
        website: true,
        start: true,
        stop: true,
        order: true,
    });

    const standardSchema = Yup.object().shape({
        id: Yup.string().required(),
        name: Yup.string().max(100),
        title: Yup.string().max(200),
        description: Yup.string().max(5000).nullable(),
        website: Yup.string().max(100).nullable(),
        start: Yup.date().nullable(),
        stop: Yup.date().nullable(),
        order: Yup.number().required(),
    });

    useEffect(() => {
        handleEditData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debounceValues]);

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setValues({
            ...values,
            [event.target.name]: event.target.value,
        });
    };

    const handleRichTextValue = (value: any) => {
        setValues({
            ...values,
            description: value,
        });
    };

    const handleDelete = () => {
        dispatch(
            editAction.deleteStandard({
                sectionId,
                standardId: data.id,
            }),
        );
    };

    const handleEditData = () => {
        standardSchema
            .validate(debounceValues, { abortEarly: false })
            .then((value) => {
                setValidateField({
                    id: true,
                    name: true,
                    title: true,
                    description: true,
                    website: true,
                    start: true,
                    stop: true,
                    order: true,
                });
                dispatch(
                    editAction.editStandard({
                        sectionId,
                        standard: debounceValues,
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
                        invalid: !validateField.name,
                    })}
                >
                    <input
                        type="text"
                        placeholder="Title"
                        value={values.name}
                        name="name"
                        onChange={handleInputChange}
                    />
                </div>
                <div
                    className={clsx(styles.subTitle, {
                        invalid: !validateField.title,
                    })}
                >
                    <input
                        type="text"
                        placeholder="Subtitle"
                        value={values.title}
                        name="title"
                        onChange={handleInputChange}
                    />
                </div>
                <div
                    className={clsx(styles.website, {
                        invalid: !validateField.website,
                    })}
                >
                    <input
                        type="text"
                        placeholder="Website"
                        value={values.website}
                        name="website"
                        onChange={handleInputChange}
                    />
                </div>
                <div className={styles.time}>
                    <TimePicker label="Start" currentTime={values.start} setCurrentTime={setTimeStart} />
                    <TimePicker
                        label="Stop"
                        currentTime={values.stop}
                        setCurrentTime={setTimeStop}
                        currentValue={values.current}
                        current
                        setCurrentValue={setCurrentChecked}
                    />
                </div>
                <div
                    className={clsx(styles.text, {
                        invalid: !validateField.description,
                    })}
                >
                    <RichTextExample contentValue={values.description} setContentValue={handleRichTextValue} />
                </div>
            </div>
        </div>
    );
};

interface TimePickerProps {
    label: string;
    current?: boolean;
    currentValue?: boolean;
    setCurrentValue?: (value: boolean) => void;
    currentTime?: string;
    setCurrentTime: (value: string) => void;
}

const styleSelect = {
    boxShadow: 'none',
    '.MuiOutlinedInput-notchedOutline': { border: 0, padding: 0 },
    '.MuiSelect-select': {
        padding: 0,
        lineHeight: '22px',
        borderRadius: 0,
        fontFamily: 'Inter',
        fontSize: '14px',
        color: '#000000',
        border: 'none',
    },
};

const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
];

const TimePicker = ({
    label,
    current = false,
    currentTime,
    setCurrentTime,
    currentValue,
    setCurrentValue,
}: TimePickerProps) => {
    const year = new Date().getFullYear();
    const years = Array.from({ length: 15 }).map((_, index) => year - index);
    let dateTime: Date;

    try {
        if (currentTime) dateTime = new Date(currentTime);
        else dateTime = new Date();
    } catch (error) {
        return null;
    }

    return (
        <div className={styles.timePicker}>
            <div className={styles.label}>{label}</div>
            <div className={styles.picker}>
                <Select
                    sx={styleSelect}
                    defaultValue={0}
                    name="start"
                    value={dateTime.getMonth()}
                    onChange={(event: SelectChangeEvent<number>) => {
                        const newDate = new Date(dateTime.getFullYear(), event.target.value as number);
                        setCurrentTime(newDate.toISOString());
                    }}
                >
                    {months.map((item, index) => (
                        <MenuItem value={index}>{item}</MenuItem>
                    ))}
                </Select>
                <Select
                    sx={styleSelect}
                    defaultValue={year}
                    name="stop"
                    value={dateTime.getFullYear()}
                    onChange={(event: SelectChangeEvent<number>) => {
                        const newDate = new Date(event.target.value as number, dateTime.getMonth());
                        setCurrentTime(newDate.toISOString());
                    }}
                >
                    {years.map((item) => (
                        <MenuItem value={item}>{item}</MenuItem>
                    ))}
                </Select>
            </div>

            {current && (
                <div className={styles.current}>
                    <input
                        type="checkbox"
                        checked={currentValue ? true : false}
                        onChange={(event: ChangeEvent<HTMLInputElement>) => {
                            const checked = event.target.checked;
                            setCurrentValue && setCurrentValue(checked);
                        }}
                    />
                    <span>Current</span>
                </div>
            )}
        </div>
    );
};

export default Standard;
