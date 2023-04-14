import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Builder from 'components/Builder';
import { useNavigate, useParams } from 'react-router';
import { useSearchParams } from 'react-router-dom';
import { getViewCV } from 'apis/view';
import styles from './style.module.scss';
import { savePDF } from '@progress/kendo-react-pdf';

function Index() {
    const [searchParams] = useSearchParams();
    const params = useParams();
    const { currentUser } = useSelector((state: any) => state.user);
    const navigate = useNavigate();
    const [cvData, setCvData] = useState();
    const printMode = searchParams.get('print_mode') || false;
    useEffect(() => {
        if (!params.id) {
            navigate('/404');
            return;
        }
        const access_token = currentUser?.access_token;
        const tokenParam = searchParams.get('token') || access_token;
        getViewCV({
            cvId: params.id,
            access_token: tokenParam,
        })
            .then((response) => {
                setCvData(response.data.data);
                if (response.data.status === 404) {
                    navigate('/404');
                }
            })
            .catch(() => {
                navigate('/404');
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const downloadAsPdf = () => {
        const cv = document.getElementById('cv-area');
        if (cv) {
            savePDF(cv, {
                paperSize: 'auto',
                fileName: 'form.pdf',
            });
        }
    };

    useEffect(() => {
        if (printMode) document.body.classList.add('bg-print');
        return () => {
            if (printMode) document.body.classList.remove('bg-print');
        };
    });

    return (
        <>
            <div className={styles['view']}>
                {printMode ? (
                    <div id="cv-area">{cvData && <Builder mode="view" data={cvData} />}</div>
                ) : (
                    <div className={styles['view__container']}>
                        <header className={styles['view__header']}>
                            <div>
                                <p>Made with</p>
                                <span>CV Builder</span>
                            </div>
                            <div className={styles['view__download']} onClick={downloadAsPdf}>
                                <svg
                                    width="26"
                                    height="26"
                                    viewBox="0 0 26 26"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M8.66669 11.9167L13 16.2501L17.3333 11.9167M13 4.0625V15.8438M20.7188 18.6875V21.5312H5.28125V18.6875"
                                        stroke="black"
                                        stroke-opacity="0.6"
                                    />
                                </svg>
                            </div>
                        </header>
                        <div id="cv-area">{cvData && <Builder mode="view" data={cvData} />}</div>
                    </div>
                )}
            </div>
        </>
    );
}

export default Index;
