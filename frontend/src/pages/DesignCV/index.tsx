import React, { useState, useRef, useEffect } from 'react';
import ChangeCV from '@/assets/img/svg/iconChangeCV.svg';
import ColorPicker from 'components/ColorPicker';
import NavEdit from 'components/Common/NavEdit/NavEdit';
import iconOpenDesign from '@/assets/img/svg/iconOpenDesign.svg';
import iconCloseDesign from '@/assets/img/svg/iconClose.svg';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { editServices } from 'apis/edit-cv';
import { editAction } from 'redux/EditCV/slice';
import { AxiosError } from 'axios';
import { ErrorResponse } from 'utils/types';
import Builder from 'components/Builder';
import saveIcon from '@/assets/img/saveIcon.svg';
import { snackBarAction } from 'redux/SnackBar/slice';
import ModalChangeTemplate from 'components/ModalChangeTemplate';
import LoadingFullPage from 'components/LoadingFullPage';
import './style.scss';
import ShareModal from 'components/ShareModal';
import { useSearchParams } from 'react-router-dom';
import ResetColorModal from 'components/ResetColorModal';
import { getExportFile, saveThumbnail } from 'apis/view';

const DesignCV: React.FC = () => {
    const { currentUser } = useSelector((state: any) => state.user);
    const { cvId, cvData, theme, loading } = useSelector((state: any) => state.edit);
    const [isShowShareModal, setIsShowShareModal] = useState(false);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    useEffect(() => {
        const queryCvId = searchParams.get('cvId');
        let cvStorageId = cvId ? cvId : queryCvId ? queryCvId : '';
        if (!cvStorageId) navigate('/dashboard');
        const getData = async () => {
            try {
                const { data: cvData } = await editServices.getCvData(cvStorageId);
                dispatch(editAction.setCv({ cvData }));
            } catch (error: any) {
                if (error instanceof AxiosError<ErrorResponse>) {
                    navigate('/home');
                }
            }
        };
        getData();
    }, [cvId, dispatch, navigate, searchParams]);

    const [isShown, setIsShown] = useState(false);
    const divRef = useRef<any>(null);
    const sectionRef = useRef<any>(null);
    const [isClose, setIsClose] = useState(false);

    const colorOptions = [
        { name: 'primaryText', label: 'Primary text', color: theme.primaryText, visibilityState: useState(false) },
        {
            name: 'sectionTitle',
            label: 'Section titles',
            color: theme.sectionTitle,
            visibilityState: useState(false),
        },
        {
            name: 'monogramBackground',
            label: 'Monogram background',
            color: theme.monogramBackground,
            visibilityState: useState(false),
        },
        {
            name: 'monogramText',
            label: 'Monogram text',
            color: theme.monogramText,
            visibilityState: useState(false),
        },
        { name: 'background', label: 'Background', color: theme.background, visibilityState: useState(false) },
    ];

    const handleToggleCate = () => {
        setIsClose(!isClose);
        divRef.current.classList.toggle('open');
        sectionRef.current.classList.toggle('open-menu');
    };

    const handleSaveCV = async () => {
        try {
            dispatch(editAction.loading(true));
            await editServices.changeTheme({ cvId, theme });
            const access_token = localStorage.getItem('access_token');
            if (access_token) saveThumbnail({ cvId, access_token });
        } catch (error) {
            if (error instanceof AxiosError<ErrorResponse>) {
                const message = error.response?.data?.message;
                dispatch(
                    snackBarAction.open({
                        message,
                        type: 'error',
                        duration: 2000,
                    }),
                );
                navigate('/home');
            }
        } finally {
            dispatch(editAction.loading(false));
            dispatch(editAction.clearUnsaved());
        }
    };

    const [isShowSaveCVModal, setIsShowSaveCVModal] = useState(false);

    const handleResetColor = () => {
        dispatch(
            editAction.setTheme({
                ...cvData.template.theme,
            }),
        );
    };

    const handleDownloadPDF = () => {
        const access_token = currentUser.access_token || localStorage.getItem('access_token');
        if (access_token) {
            dispatch(editAction.loading(true));
            getExportFile({ cvId, access_token, type: 'PDF' })
                .then((response) => {
                    let filename = 'cv.pdf';
                    const user = currentUser?.user;
                    if (user) filename = `${user.firstName}${user.lastName}-BuilderCV.pdf`;
                    filename = filename.replaceAll(' ', '');
                    const blob = new Blob([response.data], { type: 'application/pdf' });
                    const link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    link.download = filename;
                    link.click();
                })
                .finally(() => {
                    dispatch(editAction.loading(false));
                });
        }
    };

    const handleDownloadPNG = () => {
        const access_token = currentUser.access_token || localStorage.getItem('access_token');
        if (access_token) {
            dispatch(editAction.loading(true));
            getExportFile({ cvId, access_token, type: 'PNG' })
                .then((response) => {
                    let filename = 'cv.pdf';
                    const user = currentUser?.user;
                    if (user) filename = `${user.firstName}${user.lastName}-BuilderCV.png`;
                    filename = filename.replaceAll(' ', '');
                    const blob = new Blob([response.data], { type: 'application/image' });
                    const link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    link.download = filename;
                    link.click();
                })
                .finally(() => {
                    dispatch(editAction.loading(false));
                });
        }
    };

    return (
        <div className="design-wrapper">
            {isShowShareModal && <ShareModal cvId={cvId} setIsShowShareModal={setIsShowShareModal}></ShareModal>}
            <LoadingFullPage isLoading={loading} />
            <ModalChangeTemplate isOpen={isShown} setIsOpen={setIsShown} />
            <ResetColorModal
                open={isShowSaveCVModal}
                setOpen={setIsShowSaveCVModal}
                task={handleResetColor}
                btnContent={'Confirm'}
            ></ResetColorModal>
            <div className="nav_edit">
                <NavEdit
                    saveFn={handleSaveCV}
                    setIsShowShareModal={setIsShowShareModal}
                    downloadPdf={handleDownloadPDF}
                    downloadPng={handleDownloadPNG}
                />
            </div>
            <div className="design-cv">
                <div className="design-cv__left" ref={sectionRef}>
                    <button onClick={() => setIsShown(true)} className="btn-change">
                        <img src={ChangeCV} alt="" />
                        Change Template
                    </button>

                    <div className="list">Color Options</div>
                    {colorOptions.map(({ name, label, color, visibilityState: [visibility, setVisibility] }, index) => (
                        <button key={index} className="btn-items" onClick={() => setVisibility(true)}>
                            <div className="dots" style={{ background: color }}>
                                {visibility && (
                                    <ColorPicker
                                        colorName={name}
                                        currentColor={color}
                                        onClose={() => setVisibility(false)}
                                    ></ColorPicker>
                                )}
                            </div>
                            {label}
                        </button>
                    ))}
                    <button
                        className="btn-change"
                        style={{ marginTop: '20px', fontSize: '14px' }}
                        onClick={() => setIsShowSaveCVModal(true)}
                    >
                        Reset Colors
                    </button>
                </div>

                {isClose && (
                    <div className="design-cv__close" onClick={() => handleToggleCate()}>
                        <div className="close">
                            <img src={iconCloseDesign} alt="" />
                        </div>
                    </div>
                )}
                <div className="overlay" ref={divRef}></div>
                <div className="design-cv__right">{cvData && <Builder mode="edit" data={cvData} />}</div>
                <div className="design-cv__icon">
                    <div className="design-cv__icon--open" onClick={() => handleToggleCate()}>
                        <img src={iconOpenDesign} alt="" />
                        <span>Design</span>
                    </div>
                    <div className="design-cv__icon--open button--primary button-save" onClick={() => handleSaveCV()}>
                        <img src={saveIcon} alt="" />
                        <span>Save</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default DesignCV;
