import React, { useEffect, useRef, useState } from 'react';
import { validateInputEmail } from 'validate';
import { useLocation, useNavigate } from 'react-router';
import './style.scss';
import { useAuth } from 'hooks/useAuth';
import Loading from 'components/Loading';
import Header from 'components/Header/Header';

const ForgotPage: React.FC = () => {
    const [isLoading, setIsLoading] = React.useState(false);
    const [email, setEmail] = useState<string>('');
    const emailRef = useRef<HTMLDivElement>(null);
    const location = useLocation();
    const navigate = useNavigate();
    const { forgotPassword } = useAuth();

    const handleChangeInput = (e: { target: { name: string; value: string } }) => {
        setEmail(e.target.value);
    };

    const clearInput = () => {
        setEmail('');
    };

    useEffect(() => {
        location.pathname !== '/' && clearInput();
    }, [location.pathname]);

    const handleClick = () => {
        const validate = validateInputEmail(email, emailRef);
        if (!validate.valid) return;
        setIsLoading(true);
        forgotPassword({
            data: {
                email,
            },
            errorFn: () => {
                emailRef?.current?.classList.add('invalid');
                setIsLoading(false);
            },
            successFn: () => {
                setIsLoading(false);
                navigate('/');
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
                        <div className="title">
                            <p>Forgot your password?</p>
                        </div>
                        <p className="sub__title">
                            Enter your email address and we will send you an email to reset your <br /> password. If you
                            do not receive an email from us within a few <br /> moments, please check your SPAM folder.
                        </p>
                        <div className="form__account">
                            <div className="form__control">
                                <label htmlFor="forgot">Forgot your password?</label>
                                <div ref={emailRef} className="form__control--field">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={handleChangeInput}
                                        placeholder={'Email Address'}
                                        name="email"
                                        className={`text-field email`}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="form__account--btn">
                            <button className="button btn--forgot button--primary" onClick={handleClick}>
                                <span>Submit</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ForgotPage;
