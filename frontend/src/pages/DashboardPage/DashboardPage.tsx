import React, { useState, useEffect } from 'react';
import './style.scss';
import DeleteCv from '@/assets/img/deleteCv.svg';
import EditCv from '@/assets/img/editCv.svg';
import ShareCv from '@/assets/img/shareCv.svg';
import DownloadCv from '@/assets/img/downloadCv.svg';
import AddcvIcon from '@/assets/img/addCv.svg';
import DashboardImg from '@/assets/img/dashboardImage.png';
import ConfirmModal from '../../components/ConfirmModal';
import { deleteCv, getAllCv } from 'apis/cv';
import { useDispatch, useSelector } from 'react-redux';
import { formatDate } from 'utils/date';
import ShareModal from 'components/ShareModal';
import { editAction } from 'redux/EditCV/slice';
import Header from 'components/Header/Header';
import LoadingFullPage from 'components/LoadingFullPage';
import { getExportFile } from 'apis/view';
import useNavigateParams from 'hooks/useNavigateParams';
import { CVData } from 'utils/types';

const DashboardPage = () => {
    const navigate = useNavigateParams();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [isShowShareModal, setIsShowShareModal] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    const [currentCv, setCurrentCv] = React.useState<string>('');
    const { currentUser } = useSelector((state: any) => state.user);
    const [data, setData] = useState<CVData[]>([]);
    const [cvId, setCvId] = useState('');
    const getAllTemplateCV = () => {
        try {
            setIsLoading(true);
            const access_token = currentUser.access_token;
            getAllCv({ access_token })
                .then((res) => {
                    setData(res.data.data);
                })
                .finally(() => setIsLoading(false));
        } catch (error) {
            throw new Error('Error retrieving list of objects');
        }
    };
    const deleteTemplateCv = (id: string) => {
        try {
            setIsLoading(true);
            const access_token = currentUser.access_token;
            deleteCv({ cvId: id, access_token })
                .then((res) => {
                    getAllTemplateCV();
                })
                .finally(() => setIsLoading(false));
        } catch (error: any) {
            if (error.response && error.response.status === 404) {
                throw new Error('Object not found for deletion');
            } else {
                throw new Error('Error deleting object');
            }
        }
    };
    useEffect(() => {
        getAllTemplateCV();
    }, []);
    const handleClick = () => {
        navigate('/template');
    };

    const handleEditCV = (cvStorageId: string) => {
        if (cvStorageId) {
            dispatch(editAction.selectCV({ cvId: cvStorageId }));
            navigate('/edit-cv', { cvId: cvStorageId });
        }
    };

    const handleDownloadPDF = (cvStorageId: string) => {
        const access_token = currentUser.access_token || localStorage.getItem('access_token');
        if (access_token) {
            setIsLoading(true);
            getExportFile({ cvId: cvStorageId, access_token, type: 'PDF' })
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
                    setIsLoading(false);
                });
        }
    };

    const handleDownloadPNG = (cvStorageId: string) => {
        const access_token = currentUser.access_token || localStorage.getItem('access_token');
        if (access_token) {
            setIsLoading(true);
            getExportFile({ cvId: cvStorageId, access_token, type: 'PNG' })
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
                    setIsLoading(false);
                });
        }
    };

    return (
        <>
            <Header></Header>
            <LoadingFullPage isLoading={isLoading} />
            <div className="wrapper">
                <div className="container">
                    {isShowShareModal && (
                        <ShareModal cvId={cvId} setIsShowShareModal={setIsShowShareModal}></ShareModal>
                    )}
                    <ConfirmModal
                        title="Delete CV"
                        content="Are you sure you want to delete this CV? Once deleted this CV cannot be restored."
                        open={open}
                        setOpen={setOpen}
                        task={() => deleteTemplateCv(currentCv)}
                        actionName={'Delete'}
                    ></ConfirmModal>
                    <div className="dashboard">
                        <div className="dashboard__title">Your CV</div>
                        <div className="dashboard__main">
                            {data &&
                                data.map((cv, index) => {
                                    return (
                                        <div key={index} className="dashboard__main--left dashboard__main--layout">
                                            <div className="main-left__img main-img">
                                                <img src={cv.urlImage ? cv.urlImage : cv.template?.urlImage} alt="" />
                                            </div>
                                            <div className="main-left__items dashboard-items">
                                                <div className="main-left__items--title">
                                                    {cv.about.firstName && cv.about.lastName
                                                        ? `${cv.about.firstName} ${cv.about.lastName}`
                                                        : 'Document untitled'}
                                                </div>
                                                <div className="main-left__items--status">
                                                    {formatDate(cv.updatedAt)}
                                                </div>
                                                <div className="main-left__items--list">
                                                    <ul>
                                                        <li onClick={() => handleEditCV(cv.id)}>
                                                            <img src={EditCv} alt="" />
                                                            <div>Edit</div>
                                                        </li>
                                                        <li
                                                            onClick={() => {
                                                                setIsShowShareModal(true);
                                                                setCvId(cv.id);
                                                            }}
                                                        >
                                                            <img src={ShareCv} alt="" />
                                                            <div>Share a link</div>
                                                        </li>
                                                        <li
                                                            onClick={() => {
                                                                handleDownloadPDF(cv.id);
                                                            }}
                                                        >
                                                            <img src={DownloadCv} alt="" />
                                                            <div>Download PDF</div>
                                                        </li>
                                                        <li
                                                            onClick={() => {
                                                                handleDownloadPNG(cv.id);
                                                            }}
                                                        >
                                                            <img src={DownloadCv} alt="" />
                                                            <div>Download PNG</div>
                                                        </li>
                                                        <li
                                                            onClick={() => {
                                                                setOpen(true);
                                                                setCurrentCv(cv.id);
                                                            }}
                                                        >
                                                            <img src={DeleteCv} alt="" />
                                                            <div>Delete</div>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            <div className="dashboard__main--right dashboard__main--layout">
                                <div className="main-right__img main-img">
                                    <img src={DashboardImg} alt="" />
                                    <div
                                        className="img__btn-add "
                                        style={{ position: 'absolute' }}
                                        onClick={() => {
                                            handleClick();
                                        }}
                                    >
                                        <img src={AddcvIcon} alt="" />
                                    </div>
                                </div>
                                <div className="main-right__items dashboard-items">
                                    <div className="main-right__items--title ">New Resume</div>
                                    <div className="main-right__items--content">
                                        Create a tailored resume for each job application. Double your chances of
                                        getting hired!
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DashboardPage;
