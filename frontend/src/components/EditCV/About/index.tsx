import { ChangeEvent, useEffect, useState } from 'react';
import { About as IAbout, Contact as IContact } from '../../../utils/types';
import useDebounce from 'hooks/useDebounce';
import { useDispatch, useSelector } from 'react-redux';
import { EditState, editAction } from 'redux/EditCV/slice';
import * as Yup from 'yup';
import clsx from 'clsx';
import styles from './index.module.scss';
import { editServices } from 'apis/edit-cv';
interface AboutProps {
    data: {
        avatar?: string;
        about: IAbout;
        contact: IContact;
    };
}

type TempKeys = 'email' | 'phone' | 'firstName' | 'lastName' | 'title' | 'summary' | 'city' | 'state';

const About = (props: AboutProps) => {
    const { data } = props;
    const { about, contact } = data;
    const { cvId } = useSelector((state: any) => state.edit as EditState);
    const [values, setValues] = useState({ ...about, ...contact });
    const dispatch = useDispatch();
    const debounceValue = useDebounce(values, 1000);
    const [validateField, setValidateField] = useState({
        firstName: true,
        lastName: true,
        title: true,
        summary: true,
        city: true,
        state: true,
        email: true,
        phone: true,
    });

    const aboutSchema = Yup.object().shape({
        firstName: Yup.string().max(100).required(),
        lastName: Yup.string().max(100).required(),
        title: Yup.string().max(200).nullable(),
        summary: Yup.string().max(1000).nullable(),
        city: Yup.string().max(100).nullable(),
        state: Yup.string().max(100).nullable(),
        email: Yup.string().email().required(),
        phone: Yup.string()
            .matches(/^[+]?[\d\s]*$/g, 'Phone must be a valid phone number')
            .nullable(),
    });

    useEffect(() => {
        aboutSchema
            .validate(debounceValue, { abortEarly: false })
            .then((value) => {
                setValidateField({
                    firstName: true,
                    lastName: true,
                    title: true,
                    summary: true,
                    city: true,
                    state: true,
                    email: true,
                    phone: true,
                });
                dispatch(editAction.editAbout(debounceValue));
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
    }, [debounceValue]);

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setValues({
            ...values,
            [event.target.name]: event.target.value,
        });
    };

    const handleTextAreaChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setValues({
            ...values,
            summary: event.target.value,
        });
    };

    const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
        const fileList = event.target.files;
        if (fileList && cvId) {
            const formData = new FormData();
            formData.append('avatar', fileList[0]);
            dispatch(editAction.loading(true));
            editServices.uploadAvatar({ cvId, formData }).then((res) => {
                dispatch(editAction.loading(false));
                dispatch(editAction.setAvatar({ avatar: res.data.url }));
            });
        }
    };

    return (
        <div className={styles.root}>
            <div className={styles.avatarContainer}>
                <div className={styles.photoContainer}>
                    {data.avatar ? (
                        <img src={data.avatar} alt="avatar" />
                    ) : (
                        <svg width="32" height="28" viewBox="0 0 32 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M30 4H22.7L21.64 1.28C21.495 0.904125 21.2398 0.580818 20.9079 0.352421C20.576 0.124025 20.1829 0.00118668 19.78 -3.43756e-06H12.22C11.8154 -0.000831584 11.4201 0.121066 11.0862 0.349595C10.7524 0.578123 10.4957 0.902535 10.35 1.28L9.3 4H2C1.46957 4 0.960859 4.21071 0.585786 4.58578C0.210714 4.96086 0 5.46956 0 6V26C0 26.5304 0.210714 27.0391 0.585786 27.4142C0.960859 27.7893 1.46957 28 2 28H30C30.5304 28 31.0391 27.7893 31.4142 27.4142C31.7893 27.0391 32 26.5304 32 26V6C32 5.46956 31.7893 4.96086 31.4142 4.58578C31.0391 4.21071 30.5304 4 30 4ZM4.17 9.63C3.95783 9.63 3.75434 9.54571 3.60431 9.39568C3.45429 9.24565 3.37 9.04217 3.37 8.83C3.37 8.61782 3.45429 8.41434 3.60431 8.26431C3.75434 8.11428 3.95783 8.03 4.17 8.03H6.57C6.78217 8.03 6.98566 8.11428 7.13568 8.26431C7.28571 8.41434 7.37 8.61782 7.37 8.83C7.37 9.04217 7.28571 9.24565 7.13568 9.39568C6.98566 9.54571 6.78217 9.63 6.57 9.63H4.17ZM16 24C14.22 24 12.4799 23.4722 10.9999 22.4832C9.51982 21.4943 8.36627 20.0887 7.68508 18.4441C7.0039 16.7996 6.82567 14.99 7.17293 13.2442C7.5202 11.4984 8.37737 9.89471 9.63604 8.63603C10.8947 7.37736 12.4984 6.5202 14.2442 6.17293C15.99 5.82566 17.7996 6.00389 19.4442 6.68508C21.0887 7.36627 22.4943 8.51982 23.4832 9.99986C24.4722 11.4799 25 13.22 25 15C25 17.3869 24.0518 19.6761 22.364 21.364C20.6761 23.0518 18.3869 24 16 24Z"
                                fill="#F1F3F5"
                            />
                        </svg>
                    )}
                </div>
                <div className={styles.photoAction}>
                    <div>Profile Photo</div>
                    <input
                        type="file"
                        name="file"
                        id="avatarUpload"
                        style={{ display: 'none' }}
                        accept="image/*"
                        onChange={handleAvatarChange}
                    />
                    <label className={styles.addPhoto} htmlFor="avatarUpload">
                        Add Photo
                    </label>
                </div>
            </div>
            <div className={styles.informationContainer}>
                <div
                    className={clsx(styles.firstName, {
                        invalid: !validateField.firstName,
                    })}
                >
                    <input
                        name="firstName"
                        value={values.firstName}
                        onChange={handleInputChange}
                        type="text"
                        placeholder="First Name"
                    />
                </div>
                <div
                    className={clsx(styles.lastName, {
                        invalid: !validateField.lastName,
                    })}
                >
                    <input
                        name="lastName"
                        value={values.lastName}
                        onChange={handleInputChange}
                        type="text"
                        placeholder="Last Name"
                    />
                </div>
                <div
                    className={clsx(styles.title, {
                        invalid: !validateField.title,
                    })}
                >
                    <input
                        name="title"
                        value={values.title}
                        onChange={handleInputChange}
                        type="text"
                        placeholder="Title"
                    />
                </div>
                <div
                    className={clsx(styles.summary, {
                        invalid: !validateField.summary,
                    })}
                >
                    <textarea
                        name="summary"
                        placeholder="Summary"
                        value={values.summary}
                        onChange={handleTextAreaChange}
                    ></textarea>
                </div>
                <div
                    className={clsx(styles.city, {
                        invalid: !validateField.city,
                    })}
                >
                    <input
                        name="city"
                        value={values.city}
                        onChange={handleInputChange}
                        type="text"
                        placeholder="City"
                    />
                </div>
                <div
                    className={clsx(styles.state, {
                        invalid: !validateField.state,
                    })}
                >
                    <input
                        name="state"
                        value={values.state}
                        onChange={handleInputChange}
                        type="text"
                        placeholder="State or Country"
                    />
                </div>
                <div
                    className={clsx(styles.phone, {
                        invalid: !validateField.phone,
                    })}
                >
                    <input
                        name="phone"
                        value={values.phone}
                        onChange={handleInputChange}
                        type="text"
                        placeholder="Phone"
                    />
                </div>
                <div
                    className={clsx(styles.email, {
                        invalid: !validateField.email,
                    })}
                >
                    <input
                        name="email"
                        value={values.email}
                        onChange={handleInputChange}
                        type="email"
                        placeholder="Email"
                    />
                </div>
            </div>
        </div>
    );
};

export default About;
