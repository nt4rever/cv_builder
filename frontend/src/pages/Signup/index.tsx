import React, { useEffect, useRef, useState } from 'react';
import { validateInput } from 'validate';
import { IFormInput } from 'utils/types';
import { useLocation, useNavigate } from 'react-router';
import { useAuth } from 'hooks/useAuth';
import rightArrow from '../../assets/img/svg/right_arrow.svg';
import clsx from 'clsx';
import './style.scss';
import Loading from 'components/Loading';
import Header from 'components/Header/Header';
const SignUpPage: React.FC = () => {
    const [inputValue, setInputValue] = useState<IFormInput>({ email: '', password: '' });
    const { isLoading, signUp } = useAuth();
    const emailRef = useRef<HTMLInputElement>(null);
    const pwRef = useRef<HTMLInputElement>(null);
    const location = useLocation();
    const navigate = useNavigate();

    const { email, password } = inputValue;

    const handleChangeInput = (e: { target: { name: string; value: string } }) => {
        const { name, value } = e.target;
        setInputValue((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const clearInput = () => {
        setInputValue({ email: '', password: '' });
    };

    useEffect(() => {
        location.pathname !== '/' && clearInput();
    }, [location.pathname]);

    const handleSignUp = () => {
        const validate = validateInput(email, password, emailRef, pwRef);
        if (!validate.valid) {
            return;
        }

        const firstName = email.split('@')[0];
        signUp({
            data: {
                email: email,
                password: password,
                firstName,
                lastName: ' ',
            },
            successFn: () => {
                clearInput();
                navigate('/login');
            },
            errorFn: () => {
                emailRef.current?.classList.add('invalid');
            },
        });
    };

    return (
        <>
            <Header></Header>
            {isLoading && <Loading></Loading>}
            <div className="wrapper">
                <div className="layouts">
                    <div className="layout__flex--box">
                        <div className="sign-up-wrapper">
                            <div className="title">
                                <p>Create an account to save your work</p>
                            </div>
                            <p className="sub__title">You'll need this to sign in later.</p>
                            <div className="form__account">
                                <div className="form__control">
                                    <label htmlFor="email">Email</label>
                                    <div className="form__control--field">
                                        <input
                                            ref={emailRef}
                                            type="email"
                                            value={email}
                                            onChange={handleChangeInput}
                                            placeholder={'Email Address'}
                                            name="email"
                                            className={`text-field email `}
                                        />
                                    </div>
                                </div>
                                <div className="form__control">
                                    <label htmlFor="password">Password</label>
                                    <div className="form__control--field">
                                        <input
                                            ref={pwRef}
                                            type="password"
                                            value={password}
                                            onChange={handleChangeInput}
                                            placeholder={'Password'}
                                            name="password"
                                            className={`text-field password`}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="form__account--btn">
                                <button className={clsx('button btn--create button--primary')} onClick={handleSignUp}>
                                    <span>Create Account</span> <img src={rightArrow} alt="" />
                                </button>
                            </div>
                            <div className="text__create">
                                <p>
                                    By creating an account, you agree to our <br /> terms and privacy policy
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SignUpPage;
