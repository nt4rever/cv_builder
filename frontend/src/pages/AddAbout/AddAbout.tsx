import React, { useEffect, useState } from 'react';
import './style.scss';
import AboutImg from '@/assets/img/aboutIcon.svg';
import Button from 'components/Common/Button/Button';
import { IAboutProps } from '../AddCV/AddCV';
import { useSelector } from 'react-redux';
import { About, Contact, Education, Work } from 'redux/AddCv/types';
import { IrootState } from 'redux/types';
interface ErrosObject {
    firstname?: string;
    lastname?: string;
}
const AddAbout = ({ setActiveStep, inputAbout, setInputAbout, handleSubmit }: IAboutProps) => {
    const aboutInformations = useSelector<IrootState, About | undefined>(
        (state) => state.informationCv.informations?.information?.about,
    );
    const aboutContact = useSelector<IrootState, Contact | undefined>(
        (state) => state.informationCv.informations?.information?.contact,
    );
    const listEducation = useSelector<IrootState, Education[] | undefined>(
        (state) => state?.informationCv?.informations?.education,
    );
    const listJobs = useSelector<IrootState, Work[] | undefined>((state) => state?.informationCv?.informations?.work);
    const [errors, setErrors] = useState<ErrosObject>({});
    const { firstName, lastName, title, summary } = inputAbout;

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setInputAbout((prevState: About) => ({
            ...prevState,
            [name]: value,
        }));
    };
    const handleMultipleClicks = () => {
        if (!inputAbout.firstName.trim() || !inputAbout.firstName) {
            setErrors((state) => {
                return { ...state, firstname: 'First name is required' };
            });
        }
        if (!inputAbout.lastName.trim() || !inputAbout.lastName) {
            setErrors((state) => {
                return { ...state, lastname: 'Last name is required' };
            });
        }
        if (inputAbout.firstName.trim() && inputAbout.lastName.trim()) {
            setActiveStep((prev) => prev + 1);
            handleSubmit();
        }
    };
    useEffect(() => {
        setInputAbout((prevState: About) => {
            let tempState: About = { ...prevState };
            if (aboutInformations) {
                tempState = aboutInformations;
            }

            return tempState;
        });
    }, [aboutInformations]);
    return (
        <div className="add-about">
            <div className="add-about__header">
                <div className="add-about__header--img">
                    <img src={AboutImg} alt="" />
                </div>
                <div className="add-about__header--title">General information that recruiters expect.</div>
            </div>
            <div className="add-about__main">
                <section className="add-about__main--left">
                    <form className="main-left__type">
                        <div className="main-left__type--name">
                            <div className="name__input">
                                <label className="type__name--label add-about__label">First Name</label>
                                <input
                                    maxLength={150}
                                    type="text"
                                    name="firstName"
                                    value={firstName}
                                    onChange={handleInputChange}
                                    className={`${errors.firstname && 'errors-style'} type__name--text`}
                                />
                            </div>
                            <div className="name__input">
                                <label className="type__input-label add-about__label">Last Name</label>
                                <input
                                    maxLength={150}
                                    type="text"
                                    name="lastName"
                                    value={lastName}
                                    className={`${errors.lastname && 'errors-style'} type__input--text`}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                        <div className="main-left__type--title">
                            <label className="title-label add-about__label">Title</label>
                            <input
                                maxLength={150}
                                placeholder="Eg: Senior Software Engineer"
                                className="title-type"
                                type="text"
                                name="title"
                                value={title}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="main-left__type--sumary">
                            <label className="sumary-label add-about__label">Summary</label>
                            <textarea
                                maxLength={2500}
                                placeholder="A one or two sentence summary to catch the readers attention."
                                className="sumary-type"
                                name="summary"
                                value={summary}
                                onChange={handleInputChange}
                            ></textarea>
                        </div>
                    </form>
                </section>
                <div className="add-about__main--right">
                    <div className="right-addCv">
                        <div className="addCv__img">
                            {firstName || lastName ? (
                                <div className="addCv__img--color">
                                    <div className="first-letter">{firstName[0]}</div>
                                    <div className="first-letter">{lastName[0]}</div>
                                </div>
                            ) : (
                                ''
                            )}
                        </div>
                        <div className="addCv__items">
                            <div className="addCv__items--name">
                                {firstName} {lastName}
                            </div>
                            <div className="addCv__items--title">{title}</div>
                            <div className="addCv__items--info txt-add-small">
                                {!aboutContact?.city ? '' : `${aboutContact?.city}`}
                                {!aboutContact?.state ? '' : ` , ${aboutContact?.state}`}
                                {!aboutContact?.email ? '' : ` | ${aboutContact?.email}`}
                                {!aboutContact?.phone ? '' : ` | ${aboutContact?.phone}`}
                            </div>
                            <div className="addCv__items--summary txt-add-small">{summary}</div>
                            <div className="addCv__items--label txt-add-normal">
                                {listJobs?.filter((item: Work) => item.company || item.jobTitle).length ? (
                                    <div>Work Experience</div>
                                ) : (
                                    ''
                                )}
                            </div>
                            {listJobs?.map((job: Work) => {
                                return (
                                    <>
                                        <div className="addCv__items--company txt-add-large">{job.company}</div>
                                        <div className="addCv__items--jobtitle txt-add-small">{job.jobTitle}</div>
                                    </>
                                );
                            })}

                            <div className="addCv__items--label txt-add-normal">
                                {listEducation?.filter((item: Education) => item.degree || item.school).length ? (
                                    <div>Education</div>
                                ) : (
                                    ''
                                )}
                            </div>
                            {listEducation?.map((education: Education) => {
                                return (
                                    <>
                                        <div className="addCv__items--school txt-add-large">{education.school}</div>
                                        <div className="addCv__items--degree txt-add-small">{education.degree}</div>
                                    </>
                                );
                            })}
                        </div>
                    </div>
                    <div className="addCv__fadebg"></div>
                </div>
            </div>
            <Button onClick={() => handleMultipleClicks()} buttonSubmit="Next" />
        </div>
    );
};

export default AddAbout;
