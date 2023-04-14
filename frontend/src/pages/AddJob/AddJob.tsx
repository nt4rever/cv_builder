import React, { useEffect } from 'react';
import AddIcon from '@/assets/img/addJob.svg';
import Button from 'components/Common/Button/Button';
import './style.scss';
import { IProps } from '../AddCV/AddCV';
import { useSelector } from 'react-redux';
import { Work } from 'redux/AddCv/types';
import { IrootState } from 'redux/types';

const AddJob = ({ setActiveStep, inputJob, setInputJob, handleSubmit }: IProps) => {
    const listJobs = useSelector<IrootState, Work[] | undefined>((state) => state?.informationCv?.informations?.work);
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const { name, value } = event.target;
        setInputJob((prevState: Work[]) => {
            const tempState = [...prevState];
            tempState[index] = { ...tempState[index], [name]: value };
            return tempState;
        });
    };
    const handleMultipleClicks = () => {
        handleSubmit();
        setActiveStep((prev) => prev + 1);
    };
    useEffect(() => {
        if (listJobs?.length) {
            setInputJob((prevState: Work[]) => {
                let tempState: Work[] = prevState;
                tempState = listJobs;
                return tempState;
            });
        }
    }, [listJobs]);
    return (
        <div className="add-job">
            <section className="add-job__head">
                <img src={AddIcon} alt="" className="add-job__head--img" />
                <div className="add-job__head--title">Start by adding some basics about your work history.</div>
                <div className="add-job__head--content">You'll fill out the rest later.</div>
            </section>
            <form className="add-job__main">
                <div className="add-job__main--left">
                    <label className="main-left__label">Company</label>
                    <>
                        {inputJob.map((item, index) => {
                            return (
                                <input
                                    maxLength={150}
                                    className="main-left__input"
                                    value={item.company || ''}
                                    onChange={(e) => handleInputChange(e, index)}
                                    type="text"
                                    name="company"
                                />
                            );
                        })}
                    </>
                </div>
                <div className="add-job__main--right">
                    <label className="main-right__label">Job title</label>
                    <>
                        {inputJob.map((item, index) => {
                            return (
                                <input
                                    maxLength={150}
                                    className="main-right__input"
                                    value={item.jobTitle || ''}
                                    onChange={(e) => handleInputChange(e, index)}
                                    type="text"
                                    name="jobTitle"
                                />
                            );
                        })}
                    </>
                </div>
            </form>
            <button
                className="add-job__btn-submit"
                onClick={() => {
                    setInputJob((state: Work[]) => [...state, { company: '', jobTitle: '' }]);
                }}
            >
                Add Job
            </button>
            <div className="add-job__btn-next">
                <Button
                    onClick={() => {
                        handleMultipleClicks();
                    }}
                    buttonSubmit="Next"
                />
            </div>
        </div>
    );
};

export default AddJob;
