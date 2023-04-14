import React, { useEffect } from 'react';
import './style.scss';
import AboutImg from '@/assets/img/aboutIcon.svg';
import Button from 'components/Common/Button/Button';
import { IContactProps } from '../AddCV/AddCV';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { IrootState } from 'redux/types';
import { About, Contact, Education, Work } from 'redux/AddCv/types';

const AddContact = ({ setActiveStep, inputContact, setInputContact, handleSubmit }: IContactProps) => {
    const showContent = useSelector((state: any) => state.reducer);
    const aboutInformations = useSelector<IrootState, About | undefined>(
        (state) => state.informationCv.informations?.information?.about,
    );

    const contactInformations = useSelector<IrootState, Contact | undefined>(
        (state) => state.informationCv.informations?.information.contact,
    );
    const listEducation = useSelector<IrootState, Education[] | undefined>(
        (state) => state?.informationCv?.informations?.education,
    );
    const listJobs = useSelector<IrootState, Work[] | undefined>((state) => state?.informationCv?.informations?.work);
    const { city, state, email, phone } = inputContact;
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setInputContact((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };
    const handleMultipleClicks = () => {
        setActiveStep((prev) => prev + 1);
        handleSubmit();
    };
    useEffect(() => {
        setInputContact((prevState: Contact) => {
            let tempState = prevState;
            if (contactInformations) {
                tempState = contactInformations;
            }

            return tempState;
        });
    }, [contactInformations]);
    return (
        <div className="contact-layout">
            <div className="add-contact">
                <div className="add-contact__left">
                    <div className="add-contact__left--img">
                        <img src={AboutImg} alt="" />
                    </div>
                    <div className="add-contact__left--title">How can prospective employers contact you?</div>
                    <section className="add-contact__left--items">
                        <form className="left-items__type">
                            <div className="left-items__type--name">
                                <div className="name__input">
                                    <label className="type__name--label add-contact__label">City</label>
                                    <input
                                        maxLength={150}
                                        className="type__name--text"
                                        type="text"
                                        name="city"
                                        value={city}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="name__input">
                                    <label className="type__input-label add-contact__label">Stage</label>
                                    <input
                                        maxLength={150}
                                        className="type__input--text"
                                        type="text"
                                        name="state"
                                        value={state}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="name__input">
                                    <label className="type__name--label add-contact__label">Email</label>
                                    <input
                                        maxLength={150}
                                        className="type__name--text"
                                        type="text"
                                        name="email"
                                        value={email}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="name__input">
                                    <label className="type__input-label add-contact__label">Phone</label>
                                    <input
                                        maxLength={150}
                                        className="type__input--text"
                                        type="text"
                                        name="phone"
                                        value={phone}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                        </form>
                    </section>
                </div>
                <div className="add-contact__right">
                    <div className="right-addCv">
                        <div className="addCv__img">
                            {aboutInformations?.firstName || aboutInformations?.lastName ? (
                                <div className="addCv__img--color">
                                    <div className="first-letter">{aboutInformations?.firstName?.[0]}</div>
                                    <div className="first-letter">{aboutInformations?.lastName?.[0]}</div>
                                </div>
                            ) : (
                                ''
                            )}
                        </div>
                        <div className="addCv__items">
                            <div className="addCv__items--name">
                                {aboutInformations?.firstName} {aboutInformations?.lastName}
                            </div>
                            <div className="addCv__items--title">{aboutInformations?.title}</div>
                            <div className="addCv__items--info txt-add-small">
                                {!city ? '' : `${city}`}
                                {!state ? '' : ` , ${state}`}
                                {!email ? '' : ` | ${email}`}
                                {!phone ? '' : ` | ${phone}`}
                            </div>

                            <div className="addCv__items--summary txt-add-small">{aboutInformations?.summary}</div>
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
            <div className="add-contact-btn">
                <Button onClick={() => handleMultipleClicks()} buttonSubmit="Next" />
            </div>
        </div>
    );
};

export default AddContact;
