import React, { useEffect } from 'react';
import AddIcon from '@/assets/img/addJob.svg';
import Button from 'components/Common/Button/Button';
import './style.scss';
import { IEducationProps } from '../AddCV/AddCV';
import { useSelector } from 'react-redux';
import { IrootState } from 'redux/types';
import { Education } from 'redux/AddCv/types';

const AddEducation = ({ setActiveStep, inputEducation, setInputEducation, handleSubmit }: IEducationProps) => {
    const listEducation = useSelector<IrootState, Education[] | undefined>(
        (state) => state?.informationCv?.informations?.education,
    );
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const { name, value } = event.target;
        setInputEducation((prevState) => {
            const tempState: Education[] = [...prevState];
            tempState[index] = { ...tempState[index], [name]: value };
            return tempState;
        });
    };
    const handleMultipleClicks = () => {
        handleSubmit();
        setActiveStep((prev) => prev + 1);
    };
    useEffect(() => {
        if (listEducation?.length) {
            setInputEducation((prevState: Education[]) => {
                let tempState: Education[] = prevState;
                tempState = listEducation;
                return tempState;
            });
        }
    }, [listEducation]);
    return (
        <div className="add-edu">
            <section className="add-edu__head">
                <img src={AddIcon} alt="" className="add-edu__head--img" />
                <div className="add-edu__head--title">Start by adding some basics about your work history.</div>
                <div className="add-edu__head--content">You'll fill out the rest later.</div>
            </section>
            <form className="add-edu__main">
                <div className="add-edu__main--left">
                    <label className="main-left__label">School</label>
                    <>
                        {inputEducation.map((item, index) => {
                            return (
                                <input
                                    maxLength={150}
                                    className="main-left__input"
                                    value={item.school}
                                    onChange={(e) => handleInputChange(e, index)}
                                    type="text"
                                    name="school"
                                />
                            );
                        })}
                    </>
                </div>
                <div className="add-edu__main--right">
                    <label className="main-right__label">Degree</label>
                    <>
                        {inputEducation.map((item, index) => {
                            return (
                                <input
                                    maxLength={150}
                                    className="main-right__input"
                                    value={item.degree}
                                    onChange={(e) => handleInputChange(e, index)}
                                    type="text"
                                    name="degree"
                                />
                            );
                        })}
                    </>
                </div>
            </form>
            <input
                className="add-edu__btn-submit"
                type="submit"
                value={'Add Education'}
                onClick={() => {
                    setInputEducation((state) => [...state, { school: '', degree: '' }]);
                }}
            />
            <div className="add-edu__btn-next">
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

export default AddEducation;
