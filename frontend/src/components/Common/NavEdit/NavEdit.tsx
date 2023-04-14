import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import logoNav from '@/assets/img/svg/logo_cv.svg';
import pdfIcon from '@/assets/img/pdfIcon.svg';
import pngIcon from '@/assets/img/pngIcon.svg';
import webIcon from '@/assets/img/webIcon.svg';
import saveIcon from '@/assets/img/saveIcon.svg';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';
import { savePDF } from '@progress/kendo-react-pdf';
import SaveCVModal from 'components/SaveCVModal';
import './style.scss';
import { useSelector } from 'react-redux';
import { EditState } from 'redux/EditCV/slice';
import useNavigateParams from 'hooks/useNavigateParams';

interface NavEditProps {
    setIsShowShareModal: React.Dispatch<React.SetStateAction<boolean>>;
    saveFn?: () => Promise<void>;
    saveCv?: () => void;
    downloadPdf?: () => void;
    downloadPng?: () => void;
}

const NavEdit: React.FC<NavEditProps> = ({ saveFn, setIsShowShareModal, downloadPdf, downloadPng }) => {
    const { unSaved } = useSelector((state: any) => state.edit as EditState);
    const [activeItem, setActiveItem] = useState(0);
    const { pathname } = useLocation();
    const [searchParams] = useSearchParams();
    const queryCvId = searchParams.get('cvId');

    useEffect(() => {
        if (pathname.includes('/design-cv')) setActiveItem(1);
        else setActiveItem(0);
    }, [pathname]);

    const handleClick = (index: number) => {
        setActiveItem(index);
    };
    const [isOpen, setIsOpen] = useState(false);

    const downloadAsPng = () => {
        const node = document.getElementById('cv-area');
        if (!node) {
            return;
        }
        const options = {
            width: 1000,
            height: 1410,
            useCORS: true,
        };
        html2canvas(node, options).then((canvas) => {
            canvas.toBlob((blob) => {
                if (blob) {
                    setTimeout(() => {
                        saveAs(blob, 'my-cv.png');
                    }, 1000);
                }
            });
        });
    };
    const downloadAsPdf = () => {
        const cv = document.getElementById('cv-area');
        if (cv) {
            savePDF(cv, {
                paperSize: 'auto',
                fileName: 'form.pdf',
            });
        }
    };
    const dropdownRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                !(event.target instanceof HTMLElement && event.target.closest('.dropdown'))
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [setIsOpen]);
    const [isShowSaveCVModal, setIsShowSaveCVModal] = useState(false);
    const [targetRoute, setTargetRoute] = useState('');
    const [targetStep, setTargetStep] = useState(0);
    const navigate = useNavigateParams();
    const handleEditClick = () => {
        if (pathname.includes('/edit-cv')) {
            handleClick(0);
            return;
        }
        if (!unSaved) {
            navigate(`/edit-cv`, { cvId: queryCvId ? queryCvId : '' });
            handleClick(0);
        }
        setIsShowSaveCVModal(true);
        setTargetRoute('edit-cv');
        setTargetStep(0);
    };
    const handleDesignClick = () => {
        if (pathname.includes('/design-cv')) {
            handleClick(1);
            return;
        }
        if (!unSaved) {
            navigate(`/design-cv`, { cvId: queryCvId ? queryCvId : '' });
            handleClick(1);
        }
        setIsShowSaveCVModal(true);
        setTargetRoute('design-cv');
        setTargetStep(1);
    };
    window.onbeforeunload = function (e) {
        return 'Do you want to exit this page?';
    };
    return (
        <div className="navbar-edit">
            <SaveCVModal
                open={isShowSaveCVModal}
                setOpen={setIsShowSaveCVModal}
                task={() => {
                    if (queryCvId && targetRoute !== 'home') navigate(`/${targetRoute}`, { cvId: queryCvId });
                    else navigate(`/${targetRoute}`);
                    handleClick(targetStep);
                }}
                onSave={saveFn}
            ></SaveCVModal>
            <div
                className="nav-logo"
                onClick={() => {
                    if (!unSaved) {
                        navigate(`/`);
                    }
                    setIsShowSaveCVModal(true);
                    setTargetRoute('home');
                }}
            >
                <img src={logoNav} alt="" />
            </div>
            <nav className="nav-edit">
                <ul className="nav-edit__list">
                    <li className={activeItem === 0 ? 'active' : ''} onClick={handleEditClick}>
                        <p>Edit</p>
                    </li>
                    <li className={activeItem === 1 ? 'active' : ''} onClick={handleDesignClick}>
                        <p>Design</p>
                    </li>
                    <li className={activeItem === 2 ? 'active' : ''} onClick={() => handleClick(2)}>
                        <div onClick={() => setIsOpen(!isOpen)} ref={dropdownRef}>
                            Download
                        </div>
                        {isOpen && (
                            <div className="dropdown">
                                <span className="dropdown__title">Download your CV</span>
                                <div
                                    className="dropdown__list"
                                    onClick={() => {
                                        downloadPng && downloadPng();
                                    }}
                                >
                                    <div className="dropdown__list--head">
                                        <img src={pngIcon} alt="" />
                                        <p>PNG</p>
                                    </div>
                                    <span className="dropdown__list--content">
                                        To keep high quality in complex images and illustrations
                                    </span>
                                </div>
                                <div
                                    className="dropdown__list"
                                    onClick={() => {
                                        downloadPdf && downloadPdf();
                                    }}
                                >
                                    <div className="dropdown__list--head">
                                        <img src={pdfIcon} alt="" />
                                        <p>PDF</p>
                                    </div>
                                    <span className="dropdown__list--content">Ideal for documents or printing</span>
                                </div>
                                <div
                                    className="dropdown__list"
                                    onClick={() => {
                                        setIsShowShareModal(true);
                                        setIsOpen(!isOpen);
                                    }}
                                >
                                    <div className="dropdown__list--head">
                                        <img src={webIcon} alt="" />
                                        <p>View web CV</p>
                                    </div>
                                    <span className="dropdown__list--content">Share link to your web CV</span>
                                </div>
                            </div>
                        )}
                    </li>
                </ul>
            </nav>
            <button className="button button--primary" onClick={() => saveFn && saveFn()}>
                <img src={saveIcon} alt="" />
                <span>Save CV</span>
            </button>
        </div>
    );
};

export default NavEdit;
