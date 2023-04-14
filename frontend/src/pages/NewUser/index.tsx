import React from 'react';

import wavingHand from '../../assets/img/svg/waving_hand.svg';
import rightArrow from '../../assets/img/svg/right_arrow.svg';

import './style.scss';

const NewUser = () => {
    return (
        <div className="layout__flex">
            <div className="layout__flex--box">
                <div className="box__content">
                    <div className="box__content--icon">
                        <img src={wavingHand} alt="" />
                    </div>
                    <div className="title title-sm">
                        <p>Welcome to CV Builder</p>
                        <p className="box__content--text">
                            You're only a few minutes away from an impressive <br /> resume. Here's how it works.
                        </p>
                    </div>
                </div>
                <div className="box__step">
                    <div className="box__step--item">
                        <p className="text-bold">1. Setup & import data</p>
                        <p className="step__item--text">Import personal details.</p>
                    </div>
                    <div className="box__step--item">
                        <p className="text-bold">2. Review & edit</p>
                        <p className="step__item--text">Review the import and add what's missing.</p>
                    </div>
                    <div className="box__step--item">
                        <p className="text-bold">3. Pick a template & download</p>
                        <p className="step__item--text">
                            Pick a template and download a PDF, or share your web resume.
                        </p>
                    </div>
                </div>
                <div className="form__account--btn">
                    <button className="button btn--started button--primary">
                        <span>Get Started</span> <img src={rightArrow} alt="" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NewUser;
