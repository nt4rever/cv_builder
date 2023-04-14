import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import FacebookLogin from '@greatsumini/react-facebook-login';

import GoogleImage from '../../assets/img/svg/iconGoogle.svg';
import FaceBookImage from '../../assets/img/svg/iconFb.svg';
import Eye from '../../assets/img/svg/eye.svg';
import EyeSlash from '../../assets/img/svg/eyeslash.svg';
import './style.scss';
import { validateInput } from 'validate';
import { currentUser, facebookLogin, googleLogin, loginAccount } from 'apis/auth';
import { ErrorResponse, IFormInput } from 'utils/types';
import { useDispatch } from 'react-redux';
import { login } from 'redux/userSlice';
import { AxiosError } from 'axios';
import Loading from 'components/Loading';
import Header from 'components/Header/Header';

const LoginPage: React.FC = () => {
    // const currentAccount = useSelector((state: any) => state?.user?.currentUser);
    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = React.useState(false);
    const [isVisible, setIsVisible] = useState<Boolean>(true);
    const [inputValue, setInputValue] = useState<IFormInput>({ email: '', password: '' });
    const emailRef = useRef<HTMLInputElement>(null);
    const pwRef = useRef<HTMLInputElement>(null);

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

    const handleChangVisible = () => {
        setIsVisible(!isVisible);
    };

    const handleClick = () => {
        signin();
    };

    const signin = async () => {
        try {
            const validate = validateInput(email, password, emailRef, pwRef);
            if (!validate.valid) {
                return;
            }
            setIsLoading(true);
            const data = {
                email: email,
                password: password,
            };
            const res = await loginAccount(data);
            dispatch(
                login({ ...res.data, access_token: res.data.access_token, refresh_token: res.data.refresh_token }),
            );
            clearInput();
            setIsLoading(false);
            navigate('/');
        } catch (error: any) {
            if (error instanceof AxiosError<ErrorResponse>) {
                setIsLoading(false);
                if (error?.response?.data.statusCode === 401) {
                    emailRef.current?.classList.add('invalid');
                }
                if (error?.response?.data.statusCode === 403) {
                    pwRef.current?.classList.add('invalid');
                }
            }
        }
    };

    const loginGoogle = useGoogleLogin({
        onSuccess: async (credentialResponse) => {
            try {
                const token = credentialResponse.access_token;
                const res = await googleLogin({ access_token: token });
                await currentUser({ access_token: res.data.access_token });
                dispatch(
                    login({ ...res.data, access_token: res.data.access_token, refresh_token: res.data.refresh_token }),
                );
                navigate('/');
            } catch (err: any) {
                throw new Error(err);
            }
        },
    });

    return (
        <>
            <Header></Header>
            {isLoading && <Loading></Loading>}

            <div className="wrapper">
                <div className="layouts">
                    <div className="layout__flex--box">
                        <div className="title">
                            <p className="desktop">Welcome back! Please sign in.</p>
                            <p className="mobile">
                                Welcome back! <br /> Please sign in.
                            </p>
                        </div>
                        <div className="social__login">
                            <div className="social__login--item" onClick={() => loginGoogle()}>
                                <div className="social__login--icon">
                                    <img src={GoogleImage} alt="" />
                                    <p className="roboto">
                                        <span>Sign in with Google </span>
                                    </p>
                                </div>
                            </div>
                            <FacebookLogin
                                appId={`${process.env.REACT_APP_FB_ID}`}
                                onSuccess={(response) => {
                                    facebookLogin({ access_token: response.accessToken }).then((res) => {
                                        dispatch(
                                            login({
                                                ...res.data,
                                                access_token: res.data.access_token,
                                                refresh_token: res.data.refresh_token,
                                            }),
                                        );
                                        navigate('/');
                                    });
                                }}
                                onFail={(error) => {
                                    console.log('Login Failed!', error);
                                }}
                                onProfileSuccess={(response) => {
                                    console.log('Get Profile Success!', response);
                                }}
                                className="button--fb roboto"
                            >
                                <div className="social__login--item">
                                    <div className="social__login--icon">
                                        <img src={FaceBookImage} alt="" />
                                        <p className="roboto">Sign in with Facebook</p>
                                    </div>
                                </div>
                            </FacebookLogin>
                        </div>
                        <div className="or">
                            <span>OR</span>
                        </div>
                        <div className="form__login">
                            <div className="field__email">
                                <input
                                    ref={emailRef}
                                    type="email"
                                    value={email}
                                    onChange={handleChangeInput}
                                    placeholder={'Email Address'}
                                    name="email"
                                    className={`text-field email login shadow`}
                                />
                            </div>
                            <div className="field__password ">
                                <div className="field__password--text">
                                    <input
                                        ref={pwRef}
                                        type={isVisible ? 'password' : 'text'}
                                        value={password}
                                        onChange={handleChangeInput}
                                        placeholder={'Password'}
                                        name="password"
                                        className={`text-field password login shadow`}
                                    />
                                </div>

                                <span className="field__password--icon" onClick={handleChangVisible}>
                                    {isVisible ? <img src={EyeSlash} alt="" /> : <img src={Eye} alt="" />}
                                </span>
                                <p className="field__password--rule source-san-pro">
                                    Password should be between 6-16 characters.
                                </p>
                                <Link to="/forgot">
                                    <p className="forgot__text nunito">Forgot your password?</p>
                                </Link>
                            </div>
                        </div>
                        <div className="form__login--btn">
                            <button className="button btn--submit source-san-pro button--primary" onClick={handleClick}>
                                <span>Submit</span>
                            </button>
                        </div>
                        <div className="have__account source-san-pro">
                            <p>
                                Need an account?{' '}
                                <Link to="/signup">
                                    <span>Sign up for free</span>
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LoginPage;
