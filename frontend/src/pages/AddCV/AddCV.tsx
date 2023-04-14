import React, { useEffect, useState } from 'react';
import Navbar from '../../components/NavBar/index';
import AddAbout from 'pages/AddAbout/AddAbout';
import AddContact from 'pages/AddContact/AddContact';
import AddEducation from 'pages/AddEducation/AddEducation';
import AddJob from 'pages/AddJob/AddJob';
import './style.scss';
import { useDispatch } from 'react-redux';
import { About, Contact, Education } from 'redux/AddCv/types';
import { getInformationCv, postAbout, postContact, postEducation, postWork } from 'redux/AddCv/action';
import { AppDispatch } from 'redux/store';
import { Work } from 'redux/AddCv/types';
import { createCv } from 'apis/cv';
import { editAction } from 'redux/EditCV/slice';
import LoadingFullPage from 'components/LoadingFullPage';
import useNavigateParams from 'hooks/useNavigateParams';

export interface IProps {
    setActiveStep: React.Dispatch<React.SetStateAction<number>>;
    inputJob: Work[];
    setInputJob: (setValueFunc: (value: Work[]) => Work[]) => void;
    handleSubmit: () => void;
}

export interface IEducationProps {
    setActiveStep: React.Dispatch<React.SetStateAction<number>>;
    inputEducation: Education[];
    setInputEducation: (setValueFunc: (value: Education[]) => Education[]) => void;
    handleSubmit: () => void;
}

export interface IAboutProps {
    setActiveStep: React.Dispatch<React.SetStateAction<number>>;
    inputAbout: About;
    setInputAbout: (setValueFunc: (value: About) => About) => void;
    handleSubmit: () => void;
}

export interface IContactProps {
    setActiveStep: React.Dispatch<React.SetStateAction<number>>;
    inputContact: Contact;
    setInputContact: (setValueFunc: (value: Contact) => Contact) => void;
    handleSubmit: () => void;
}

const AddPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigateParams();
    const [inputJob, setInputJob] = useState<Work[]>([
        {
            company: '',
            jobTitle: '',
        },
    ]);
    const [inputEducation, setInputEducation] = useState<Education[]>([
        {
            school: '',
            degree: '',
        },
    ]);
    const [inputAbout, setInputAbout] = useState<About>({
        firstName: '',
        lastName: '',
        title: '',
        summary: '',
    });
    const [inputContact, setInputContact] = useState<Contact>({
        city: '',
        state: '',
        email: '',
        phone: '',
    });
    const [isLoading, setIsLoading] = useState(false);

    const [activeStep, setActiveStep] = useState(1);
    const handleNextAndBack = () => {
        switch (activeStep) {
            case 1: {
                const listJobs = inputJob
                    .filter((job) => (job.company?.trim() && job.jobTitle?.trim()) || job.id)
                    .map((job) => ({ id: job.id, company: job.company?.trim(), jobTitle: job.jobTitle?.trim() }));
                if (listJobs.length) {
                    postWork(listJobs).then(() => {
                        setTimeout(() => {
                            dispatch(getInformationCv());
                        }, 1000);
                    });
                }
                break;
            }
            case 2: {
                const listEducation = inputEducation
                    .filter((education) => (education?.school?.trim() && education?.degree?.trim()) || education.id)
                    .map((education) => ({
                        id: education?.id,
                        school: education?.school?.trim(),
                        degree: education?.degree?.trim(),
                    }));
                if (listEducation.length) {
                    postEducation(listEducation).then(() => {
                        setTimeout(() => {
                            dispatch(getInformationCv());
                        }, 1000);
                    });
                }
                break;
            }
            case 3: {
                postAbout(inputAbout).then(() => {
                    dispatch(getInformationCv());
                });

                break;
            }
            default: {
                finishAddCv();
                break;
            }
        }
    };

    const finishAddCv = async () => {
        try {
            setIsLoading(true);
            await postContact(inputContact);
            const { data } = await createCv({ templateId: '63f4752d22ef932fff6e4daf' });
            dispatch(editAction.selectCV({ cvId: data.data.id }));
            navigate('/edit-cv', { cvId: data.data.id });
        } catch (error) {
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        dispatch(getInformationCv());
    }, [dispatch]);
    return (
        <div className="wrapper">
            <LoadingFullPage isLoading={isLoading} />
            <Navbar handleBack={handleNextAndBack} activeStep={activeStep} setActiveStep={setActiveStep} />
            <div className="container">
                <div>
                    {activeStep === 1 && (
                        <AddJob
                            handleSubmit={handleNextAndBack}
                            inputJob={inputJob}
                            setInputJob={setInputJob}
                            setActiveStep={setActiveStep}
                        />
                    )}
                    {activeStep === 2 && (
                        <AddEducation
                            inputEducation={inputEducation}
                            setInputEducation={setInputEducation}
                            setActiveStep={setActiveStep}
                            handleSubmit={handleNextAndBack}
                        />
                    )}
                    {activeStep === 3 && (
                        <AddAbout
                            handleSubmit={handleNextAndBack}
                            inputAbout={inputAbout}
                            setInputAbout={setInputAbout}
                            setActiveStep={setActiveStep}
                        />
                    )}
                    {activeStep === 4 && (
                        <AddContact
                            handleSubmit={handleNextAndBack}
                            inputContact={inputContact}
                            setInputContact={setInputContact}
                            setActiveStep={setActiveStep}
                        />
                    )}
                </div>
                <div></div>
            </div>
        </div>
    );
};

export default AddPage;
