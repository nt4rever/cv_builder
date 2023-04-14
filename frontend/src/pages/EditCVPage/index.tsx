import NavEdit from 'components/Common/NavEdit/NavEdit';
import styles from './index.module.scss';
import SideBar from 'components/EditCV/SideBar';
import SectionContainer from 'components/EditCV/Section';
import About from 'components/EditCV/About';
import Standard from 'components/EditCV/Standard';
import Detail from 'components/EditCV/Detail';
import Tag from 'components/EditCV/Tag';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import { editServices } from 'apis/edit-cv';
import { EditState, editAction } from 'redux/EditCV/slice';
import { AxiosError } from 'axios';
import { ErrorResponse } from 'utils/types';
import LoadingFullPage from 'components/LoadingFullPage';
import ModalSelectSection from 'components/EditCV/ModalSelectSection';
import { useSearchParams } from 'react-router-dom';
import { getExportFile } from 'apis/view';

const EditCVPage = () => {
    const { currentUser } = useSelector((state: any) => state.user);
    const editState = useSelector((state: any) => state.edit as EditState);
    const [searchParams] = useSearchParams();
    const { cvId, cvData, loading, render } = editState;
    const [mobileShow, setMobileShow] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    useEffect(() => {
        const queryCvId = searchParams.get('cvId');
        let cvStorageId = cvId ? cvId : queryCvId ? queryCvId : '';

        if (cvStorageId) {
            const getData = async () => {
                try {
                    dispatch(editAction.loading(true));
                    const { data: cvData } = await editServices.getCvData(cvStorageId);
                    dispatch(editAction.setCv({ cvData }));
                } catch (error: any) {
                    if (error instanceof AxiosError<ErrorResponse>) {
                    }
                } finally {
                    dispatch(editAction.loading(false));
                    dispatch(editAction.clearUnsaved());
                }
            };
            getData();
        } else navigate('/dashboard');
    }, [cvId, dispatch, navigate, searchParams]);

    const handleAddItem = ({ sectionId, type }: { sectionId: string; type: 'STANDARD' | 'DETAIL' }) => {
        dispatch(
            editAction.addItem({
                sectionId,
                type,
            }),
        );
    };

    const handleSave = async () => {
        dispatch(editAction.loading(true));
        await editServices.updateCV(editState);
        if (cvId) {
            try {
                const { data: cvData } = await editServices.getCvData(cvId);
                dispatch(editAction.setCv({ cvData }));
            } catch (error: any) {
                if (error) {
                    navigate('/home');
                }
            }
        } else navigate('/home');

        dispatch(editAction.loading(false));
    };

    const handleDownloadPDF = () => {
        const access_token = currentUser.access_token || localStorage.getItem('access_token');
        if (access_token && cvId) {
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
        if (access_token && cvId) {
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
        <div className={styles.root}>
            <ModalSelectSection />
            <LoadingFullPage isLoading={loading} />
            <NavEdit
                saveFn={handleSave}
                setIsShowShareModal={() => {}}
                downloadPdf={handleDownloadPDF}
                downloadPng={handleDownloadPNG}
            />
            <div className={styles.wrapper}>
                <div className={styles.sidebar}>
                    <SideBar data={cvData} isRender={render} />
                </div>
                <div className={styles.container}>
                    {cvData?.about && cvData?.contact && (
                        <SectionContainer sectionId="null" heading="About">
                            <About
                                data={{
                                    about: cvData.about,
                                    contact: cvData.contact,
                                    avatar: cvData.avatar,
                                }}
                            />
                        </SectionContainer>
                    )}
                    {cvData &&
                        [...cvData.sections]
                            .sort((a, b) => a.order - b.order)
                            .map((section) => {
                                if (section.type === 'STANDARD')
                                    return (
                                        <SectionContainer
                                            sectionId={section.id}
                                            heading={section.heading}
                                            editHeading
                                            key={section.id}
                                        >
                                            {section.standards.map((standard) => (
                                                <Standard data={standard} sectionId={section.id} key={standard.id} />
                                            ))}
                                            <AddItem
                                                sectionId={section.id}
                                                type={section.type}
                                                addItemFn={handleAddItem}
                                            />
                                        </SectionContainer>
                                    );

                                if (section.type === 'DETAIL')
                                    return (
                                        <SectionContainer
                                            sectionId={section.id}
                                            heading={section.heading}
                                            editHeading
                                            key={section.id}
                                        >
                                            {section.details.map((detail) => (
                                                <Detail data={detail} sectionId={section.id} key={detail.id} />
                                            ))}
                                            <AddItem
                                                sectionId={section.id}
                                                type={section.type}
                                                addItemFn={handleAddItem}
                                            />
                                        </SectionContainer>
                                    );
                                if (section.type === 'TAG')
                                    return (
                                        <SectionContainer
                                            sectionId={section.id}
                                            heading={section.heading}
                                            editHeading
                                            key={section.id}
                                        >
                                            <Tag tags={section.tags} sectionId={section.id} />
                                        </SectionContainer>
                                    );
                                return null;
                            })}
                </div>
            </div>
            <div className={styles.actionMobile}>
                <div className={styles.button} onClick={handleSave}>
                    <div>
                        <svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M21.751 5.34478L17.6552 1.24897C17.2157 0.809435 16.6195 0.562503 15.9979 0.5625H2.90625C1.61182 0.5625 0.5625 1.61182 0.5625 2.90625V20.0938C0.5625 21.3882 1.61182 22.4375 2.90625 22.4375H20.0938C21.3882 22.4375 22.4375 21.3882 22.4375 20.0938V7.00205C22.4375 6.38045 22.1906 5.78431 21.751 5.34478ZM11.5 19.3125C9.77412 19.3125 8.375 17.9134 8.375 16.1875C8.375 14.4616 9.77412 13.0625 11.5 13.0625C13.2259 13.0625 14.625 14.4616 14.625 16.1875C14.625 17.9134 13.2259 19.3125 11.5 19.3125ZM16.1875 4.44336V9.35156C16.1875 9.67515 15.9251 9.9375 15.6016 9.9375H4.27344C3.94985 9.9375 3.6875 9.67515 3.6875 9.35156V4.27344C3.6875 3.94985 3.94985 3.6875 4.27344 3.6875H15.4316C15.5871 3.6875 15.7361 3.74922 15.8459 3.85913L16.0159 4.02905C16.0703 4.08345 16.1135 4.14804 16.1429 4.21913C16.1724 4.29022 16.1875 4.36641 16.1875 4.44336Z"
                                fill="white"
                            />
                        </svg>
                    </div>
                    <span>Save</span>
                </div>
                <div className={styles.button} onClick={() => setMobileShow(true)}>
                    <div>
                        <svg width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M5 0.5H20H5ZM0 0.5H2H0ZM5 5.5H20H5ZM2.00272e-05 5.5H2.00002H2.00272e-05ZM5 10.5H20H5ZM2.00272e-05 10.5H2.00002H2.00272e-05ZM5 15.5H20H5ZM0 15.5H2H0Z"
                                fill="black"
                            />
                            <path
                                d="M5 0.5H20M0 0.5H2M5 5.5H20M2.00272e-05 5.5H2.00002M5 10.5H20M2.00272e-05 10.5H2.00002M5 15.5H20M0 15.5H2"
                                stroke="white"
                            />
                        </svg>
                    </div>
                    <span>Section</span>
                </div>
            </div>
            <div className={styles.sidebarMobile} style={{ display: mobileShow ? 'block' : 'none' }}>
                <div className={styles.tabContent}>
                    <h1>{`${cvData?.about.firstName} ${cvData?.about.lastName}`}</h1>
                    <SideBar data={cvData} isRender={render} />
                </div>
                <div className={styles.btnClose} onClick={() => setMobileShow(false)}>
                    <svg width="19" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M15.0284 0.861984L9.91335 5.74479L4.79834 0.861983C4.17069 0.262822 3.15266 0.262822 2.52501 0.861983L1.38834 1.94705C0.760686 2.54621 0.760686 3.51803 1.38834 4.11719L6.50334 9L1.38834 13.8828C0.760686 14.482 0.760686 15.4538 1.38834 16.0529L2.52501 17.138C3.15266 17.7372 4.17069 17.7372 4.79834 17.138L9.91335 12.2552L15.0284 17.138C15.656 17.7372 16.674 17.7372 17.3017 17.138L18.4384 16.0529C19.066 15.4538 19.066 14.482 18.4384 13.8828L13.3233 9L18.4384 4.11719C19.066 3.51803 19.066 2.54621 18.4384 1.94705L17.3017 0.861982C16.674 0.262822 15.656 0.262822 15.0284 0.861984Z"
                            fill="black"
                        />
                    </svg>
                </div>
            </div>
        </div>
    );
};

interface AddItemProps {
    sectionId: string;
    type: 'STANDARD' | 'DETAIL';
    addItemFn: ({ sectionId, type }: { sectionId: string; type: 'STANDARD' | 'DETAIL' }) => void;
}

const AddItem = ({ addItemFn, sectionId, type }: AddItemProps) => {
    return (
        <div className={styles.addItem} onClick={() => addItemFn({ sectionId, type })}>
            <span>+</span> Add Item
        </div>
    );
};

export default EditCVPage;
