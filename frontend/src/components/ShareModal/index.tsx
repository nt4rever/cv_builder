import { changStatusShareCv, getOneCv } from 'apis/cv';
import Loading from 'components/Loading';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import styles from './style.module.scss';

interface IProps {
    setIsShowShareModal: React.Dispatch<React.SetStateAction<boolean>>;
    cvId: string;
}

const baseURL = process.env.REACT_APP_URL || 'http://localhost:3000';

function ShareModal({ cvId, setIsShowShareModal }: IProps) {
    const [isLoading, setIsLoading] = React.useState(false);
    const { currentUser } = useSelector((state: any) => state.user);
    const [cvData, setCvData] = useState({
        isPublic: false,
    });

    const [isShowOption, setIsShowOption] = useState(false);
    const [option, setOption] = useState('Public');
    const inputRef = useRef<HTMLInputElement>(null);

    const handleCopy = () => {
        if (inputRef.current) {
            inputRef.current.select();
            document.execCommand('copy');
        }
    };
    useEffect(() => {
        if (!cvId) return;
        setIsLoading(true);
        getOneCv({
            access_token: currentUser.acess_token,
            cvId: cvId,
        }).then((response) => {
            setCvData(response.data);
            setIsLoading(false);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [option]);

    useEffect(() => {
        cvData.isPublic ? setOption('Public') : setOption('Private');
    }, [cvData]);
    const handleChangeOption = (option: string) => {
        switch (option) {
            case 'Public':
                changStatusShareCv({
                    access_token: currentUser.acess_token,
                    cvId: cvId,
                    isPublic: true,
                })
                    .then((reponse) => {
                        setOption(option);
                    })
                    .catch((error) => {
                        console.log(error);
                    });
                break;
            case 'Private':
                changStatusShareCv({
                    access_token: currentUser.acess_token,
                    cvId: cvId,
                    isPublic: false,
                })
                    .then((reponse) => {
                        setOption(option);
                    })
                    .catch((error) => {
                        console.log(error);
                    });
                break;
        }
    };

    return (
        <>
            {isLoading && <Loading></Loading>}
            <div className={styles['share']}>
                <div className={styles['share__modal']}>
                    <p className={styles['share__heading']}>SHARE CV</p>
                    <div className={styles['share__select']} onClick={() => setIsShowOption(!isShowOption)}>
                        {option === 'Public' ? (
                            <div>
                                <svg
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M12 21C13.995 20.9999 15.9335 20.3372 17.511 19.116C19.0886 17.8948 20.2159 16.1843 20.716 14.253M12 21C10.005 20.9999 8.06654 20.3372 6.48898 19.116C4.91141 17.8948 3.78408 16.1843 3.284 14.253M12 21C14.485 21 16.5 16.97 16.5 12C16.5 7.03 14.485 3 12 3M12 21C9.515 21 7.5 16.97 7.5 12C7.5 7.03 9.515 3 12 3M20.716 14.253C20.901 13.533 21 12.778 21 12C21.0025 10.4521 20.6039 8.92999 19.843 7.582M20.716 14.253C18.0492 15.7314 15.0492 16.5048 12 16.5C8.95082 16.5047 5.95085 15.7313 3.284 14.253M3.284 14.253C3.09475 13.517 2.99933 12.76 3 12C3 10.395 3.42 8.887 4.157 7.582M12 3C13.5962 2.99933 15.1639 3.42336 16.5422 4.22856C17.9205 5.03377 19.0597 6.19117 19.843 7.582M12 3C10.4038 2.99933 8.83608 3.42336 7.45781 4.22856C6.07954 5.03377 4.94031 6.19117 4.157 7.582M19.843 7.582C17.6657 9.46793 14.8805 10.5041 12 10.5C9.002 10.5 6.26 9.4 4.157 7.582"
                                        stroke="black"
                                        stroke-width="1.5"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    />
                                </svg>
                            </div>
                        ) : (
                            <div>
                                <svg
                                    width="18"
                                    height="17"
                                    viewBox="0 0 18 17"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M9 11.0055V12.6731M3 16.0083H15C15.5304 16.0083 16.0391 15.8326 16.4142 15.5199C16.7893 15.2072 17 14.783 17 14.3407V9.33795C17 8.89568 16.7893 8.47152 16.4142 8.15879C16.0391 7.84605 15.5304 7.67036 15 7.67036H3C2.46957 7.67036 1.96086 7.84605 1.58579 8.15879C1.21071 8.47152 1 8.89568 1 9.33795V14.3407C1 14.783 1.21071 15.2072 1.58579 15.5199C1.96086 15.8326 2.46957 16.0083 3 16.0083ZM13 7.67036V4.33518C13 3.45064 12.5786 2.60232 11.8284 1.97685C11.0783 1.35138 10.0609 1 9 1C7.93913 1 6.92172 1.35138 6.17157 1.97685C5.42143 2.60232 5 3.45064 5 4.33518V7.67036H13Z"
                                        stroke="black"
                                        stroke-width="1.5"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    />
                                </svg>
                            </div>
                        )}
                        <p>{option === 'Public' ? 'Public' : 'Private'}</p>
                        <svg
                            width="8"
                            height="6"
                            viewBox="0 0 8 6"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            style={
                                isShowOption
                                    ? {
                                          transform: 'scaleY(-1)',
                                          transition: 'all 0.3s',
                                      }
                                    : { transition: 'all 0.3s' }
                            }
                        >
                            <path
                                d="M0.672857 0.86145L7.32714 0.86145C7.92547 0.86145 8.22463 1.59763 7.80245 2.02683L4.47531 5.40927C4.21249 5.67646 3.78751 5.67646 3.52749 5.40927L0.197551 2.02683C-0.224633 1.59763 0.0745303 0.86145 0.672857 0.86145Z"
                                fill="black"
                            />
                        </svg>

                        {isShowOption && (
                            <ul className={styles['share__list']}>
                                <li className={styles['share__option']} onClick={() => handleChangeOption('Private')}>
                                    <div>
                                        <svg
                                            width="18"
                                            height="17"
                                            viewBox="0 0 18 17"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M9 11.0055V12.6731M3 16.0083H15C15.5304 16.0083 16.0391 15.8326 16.4142 15.5199C16.7893 15.2072 17 14.783 17 14.3407V9.33795C17 8.89568 16.7893 8.47152 16.4142 8.15879C16.0391 7.84605 15.5304 7.67036 15 7.67036H3C2.46957 7.67036 1.96086 7.84605 1.58579 8.15879C1.21071 8.47152 1 8.89568 1 9.33795V14.3407C1 14.783 1.21071 15.2072 1.58579 15.5199C1.96086 15.8326 2.46957 16.0083 3 16.0083ZM13 7.67036V4.33518C13 3.45064 12.5786 2.60232 11.8284 1.97685C11.0783 1.35138 10.0609 1 9 1C7.93913 1 6.92172 1.35138 6.17157 1.97685C5.42143 2.60232 5 3.45064 5 4.33518V7.67036H13Z"
                                                stroke="black"
                                                stroke-width="1.5"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                            />
                                        </svg>
                                    </div>
                                    <p>Private</p>
                                </li>
                                <li className={styles['share__option']} onClick={() => handleChangeOption('Public')}>
                                    <div>
                                        <svg
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M12 21C13.995 20.9999 15.9335 20.3372 17.511 19.116C19.0886 17.8948 20.2159 16.1843 20.716 14.253M12 21C10.005 20.9999 8.06654 20.3372 6.48898 19.116C4.91141 17.8948 3.78408 16.1843 3.284 14.253M12 21C14.485 21 16.5 16.97 16.5 12C16.5 7.03 14.485 3 12 3M12 21C9.515 21 7.5 16.97 7.5 12C7.5 7.03 9.515 3 12 3M20.716 14.253C20.901 13.533 21 12.778 21 12C21.0025 10.4521 20.6039 8.92999 19.843 7.582M20.716 14.253C18.0492 15.7314 15.0492 16.5048 12 16.5C8.95082 16.5047 5.95085 15.7313 3.284 14.253M3.284 14.253C3.09475 13.517 2.99933 12.76 3 12C3 10.395 3.42 8.887 4.157 7.582M12 3C13.5962 2.99933 15.1639 3.42336 16.5422 4.22856C17.9205 5.03377 19.0597 6.19117 19.843 7.582M12 3C10.4038 2.99933 8.83608 3.42336 7.45781 4.22856C6.07954 5.03377 4.94031 6.19117 4.157 7.582M19.843 7.582C17.6657 9.46793 14.8805 10.5041 12 10.5C9.002 10.5 6.26 9.4 4.157 7.582"
                                                stroke="black"
                                                stroke-width="1.5"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                            />
                                        </svg>
                                    </div>
                                    <p>Public</p>
                                </li>
                            </ul>
                        )}
                    </div>
                    <p className={styles['share__desc']}>
                        {option === 'Public' ? 'Anyone with the link can view this CV' : 'Only you can view this CV'}
                    </p>
                    {option === 'Public' && (
                        <div className={styles['share__row']}>
                            <input value={`${baseURL}/${cvId}/view`} type="text" ref={inputRef}></input>
                            <button
                                className={`${styles['share__button']} ${styles['share__button--secondary']} copy-btn`}
                                onClick={handleCopy}
                            >
                                Copy
                            </button>
                        </div>
                    )}
                    <button
                        className={`${styles['share__button']} ${styles['share__button--primary']}`}
                        onClick={() => setIsShowShareModal(false)}
                    >
                        Close
                    </button>
                </div>
            </div>
        </>
    );
}

export default ShareModal;
