import * as React from 'react';
import { useEffect } from 'react';
import './style.scss';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import { makeStyles } from '@material-ui/core/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import clsx from 'clsx';
import Eye from '@/assets/img/svg/eye.svg';
import EyeClose from '@/assets/img/svg/eyeslash.svg';
import { useDispatch, useSelector } from 'react-redux';
import { currentUser, deleteAccount, updateAccount } from 'apis/auth';
import Header from 'components/Header/Header';
import { useNavigate } from 'react-router';
import ConfirmModal from 'components/ConfirmModal';
import { update } from 'redux/userSlice';
import Loading from 'components/Loading';

const useStyles = makeStyles((theme) => ({
    inputStyle: {
        width: '100%',
    },
    formStyle: {
        width: '100%',
    },
    inputStyleLeft: {
        marginRight: '40px',
    },
}));

interface IState {
    UserInfo: {
        createdAt: string;
        email: string;
        facebookProvider: string;
        firstName: string;
        googleProvider: string;
        id: string;
        lastName: string;
        updatedAt: string;
    };
    UserInput: {
        firstName: string;
        lastName: string;
        oldPassword: string | null;
        newPassword: string | null;
    };
    IsValid: {
        firstName: boolean;
        lastName: boolean;
        oldPassword: boolean;
        newPassword: boolean;
    };
}

const Account: React.FC = () => {
    const dispatch = useDispatch();
    const currentAccount = useSelector((state: any) => state?.user?.currentUser);
    const [showPassword, setShowPassword] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const [userInfo, setUserInfo] = React.useState<IState['UserInfo']>({
        createdAt: '',
        email: '',
        facebookProvider: '',
        firstName: '',
        googleProvider: '',
        id: '',
        lastName: '',
        updatedAt: '',
    });
    const [userInput, setUserInput] = React.useState<IState['UserInput']>({
        firstName: '',
        lastName: '',
        oldPassword: '',
        newPassword: '',
    });
    const [isValid, setIsValid] = React.useState<IState['IsValid']>({
        firstName: true,
        lastName: true,
        oldPassword: true,
        newPassword: true,
    });
    const fnRef = React.useRef<any>(null);
    const lnRef = React.useRef<any>(null);
    const opRef = React.useRef<any>(null);
    const npRef = React.useRef<any>(null);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const [value, setValue] = React.useState(0);
    const [showPasswordFirst, setShowPasswordFirst] = React.useState(false);
    const [showPasswordSecond, setShowPasswordSecond] = React.useState(false);
    const handleClickShowPasswordFirst = () => setShowPasswordFirst((show) => !show);
    const handleClickShowPasswordSecond = () => setShowPasswordSecond((show) => !show);
    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };
    const classes = useStyles();

    const getUser = async () => {
        const res = await currentUser({ access_token: currentAccount.access_token });
        setUserInfo(res.data);
        setUserInput({
            firstName: res.data.firstName,
            lastName: res.data.lastName,
            oldPassword: '',
            newPassword: '',
        });
    };

    useEffect(() => {
        getUser();
    }, []);

    const validateInput = (userInput: IState['UserInput']): boolean => {
        const newValidate: IState['IsValid'] = {
            firstName: true,
            lastName: true,
            oldPassword: true,
            newPassword: true,
        };
        var nameFormat = /^[a-zA-Z0-9\s]*$/;
        if (
            userInput.firstName === userInfo.firstName &&
            userInput.lastName === userInfo.lastName &&
            userInput.oldPassword !== null &&
            userInput.oldPassword.length < 1 &&
            userInput.newPassword !== null &&
            userInput.newPassword.length < 1
        ) {
            return false;
        }
        if (userInput.firstName.length < 1 && userInput.lastName.length < 1) {
            setIsValid({ ...newValidate, lastName: false, firstName: false });
            fnRef.current.getElementsByTagName('input')[0].focus();
            return false;
        }
        if (userInput.firstName.length < 1) {
            setIsValid({ ...newValidate, firstName: false });
            fnRef.current.getElementsByTagName('input')[0].focus();
            return false;
        }
        if (userInput.lastName.length < 1) {
            setIsValid({ ...newValidate, lastName: false });
            lnRef.current.getElementsByTagName('input')[0].focus();
            return false;
        }
        if (
            userInput.newPassword !== null &&
            userInput.newPassword.length > 0 &&
            (userInput.newPassword.length > 150 || userInput.newPassword.length < 6)
        ) {
            setIsValid({ ...newValidate, newPassword: false });
            npRef.current.getElementsByTagName('input')[0].focus();
            return false;
        }
        if (
            userInput.oldPassword !== null &&
            userInput.oldPassword.length > 0 &&
            (userInput.oldPassword.length > 150 || userInput.oldPassword.length < 6)
        ) {
            setIsValid({ ...newValidate, oldPassword: false });
            opRef.current.getElementsByTagName('input')[0].focus();
            return false;
        }
        if (userInput.oldPassword === '' && userInput.newPassword !== '') {
            setIsValid({ ...newValidate, oldPassword: false });
            opRef.current.getElementsByTagName('input')[0].focus();
            return false;
        }
        if (userInput.newPassword === '' && userInput.oldPassword !== '') {
            setIsValid({ ...newValidate, newPassword: false });
            npRef.current.getElementsByTagName('input')[0].focus();
            return false;
        }
        if (
            userInput.newPassword !== null &&
            userInput.newPassword.length > 0 &&
            userInput.oldPassword === userInput.newPassword
        ) {
            setIsValid({ ...newValidate, newPassword: false });
            npRef.current.getElementsByTagName('input')[0].focus();
            return false;
        }
        if (!userInput.firstName.match(nameFormat)) {
            setIsValid({ ...newValidate, firstName: false });
            fnRef.current.getElementsByTagName('input')[0].focus();
            return false;
        }
        if (!userInput.lastName.match(nameFormat)) {
            setIsValid({ ...newValidate, lastName: false });
            lnRef.current.getElementsByTagName('input')[0].focus();
            return false;
        }
        return true;
    };

    const handleSubmit = async () => {
        if (!validateInput(userInput)) return;
        setIsLoading(true);
        if (userInput.newPassword !== null && userInput.newPassword.length >= 6) {
            updateAccount({
                firstName: userInput.firstName.trim(),
                lastName: userInput.lastName.trim(),
                oldPassword: userInput.oldPassword,
                newPassword: userInput.newPassword,
                access_token: currentAccount.access_token,
            })
                .then((res) => {
                    setIsLoading(false);
                    window.location.reload();
                })
                .catch((error) => {
                    setIsValid({ firstName: true, lastName: true, newPassword: true, oldPassword: false });
                    opRef.current.getElementsByTagName('input')[0].focus();
                    setIsLoading(false);
                });
        } else {
            updateAccount({
                firstName: userInput.firstName.trim(),
                lastName: userInput.lastName.trim(),
                oldPassword: null,
                newPassword: null,
                access_token: currentAccount.access_token,
            })
                .then(() => {
                    const newProfile = {
                        ...currentAccount,
                        user: {
                            ...currentAccount.user,
                            firstName: userInput.firstName.trim(),
                            lastName: userInput.lastName.trim(),
                        },
                    };
                    dispatch(update({ ...newProfile, access_token: newProfile.access_token }));
                    setIsLoading(false);
                    window.location.reload();
                })
                .catch((error) => {
                    setIsValid({ firstName: true, lastName: true, newPassword: true, oldPassword: false });
                    opRef.current.getElementsByTagName('input')[0].focus();
                    setIsLoading(false);
                });
        }
        return;
    };
    const navigate = useNavigate();
    const [open, setOpen] = React.useState(false);
    const handleDeleteAccount = () => {
        deleteAccount(currentAccount.access_token)
            .then(() => {
                localStorage.removeItem('persist:root');
                localStorage.removeItem('currentUser');
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                navigate('/home');

                window.location.reload();
            })
            .catch((err) => {
                console.log(err);
            });
    };
    return (
        <>
            {isLoading && <Loading></Loading>}
            <Header></Header>
            <ConfirmModal
                title="Delete Account"
                content="Are you sure you want to delete this account? Once deleted this account cannot be restored."
                open={open}
                setOpen={setOpen}
                task={handleDeleteAccount}
                actionName={'Delete'}
            ></ConfirmModal>
            <div className="container">
                <div className="account">
                    <div className="account__title">
                        <p>Account Settings</p>
                    </div>
                    <div className="account__label">
                        <p>account</p>
                    </div>
                    <div className="account__frame">
                        <Box className={classes.formStyle} component="form" noValidate autoComplete="off">
                            <div className="frame__note ">
                                <div className="frame__top">
                                    <div className={clsx(classes.inputStyleLeft, 'frame__text frame_left')}>
                                        <label htmlFor="">First Name</label>
                                        <div>
                                            <FormControl className={classes.inputStyle} variant="outlined">
                                                <OutlinedInput
                                                    inputProps={{ maxLength: 150 }}
                                                    ref={fnRef}
                                                    sx={{
                                                        width: '100%',
                                                        borderRadius: '0px !important',
                                                        background: '#f2f7fc',
                                                        height: 48,
                                                        border: `${`${
                                                            isValid.firstName ? 'none' : '2px solid red !important'
                                                        }`}`,
                                                        '& fieldset': { border: 'none' },
                                                        '& input:focus': {
                                                            border: 'none!important',
                                                        },
                                                    }}
                                                    size="small"
                                                    id="firtname-input"
                                                    endAdornment={<InputAdornment position="end"></InputAdornment>}
                                                    value={userInput.firstName}
                                                    onChange={(e) =>
                                                        setUserInput({ ...userInput, firstName: e.target.value })
                                                    }
                                                />
                                            </FormControl>
                                        </div>
                                    </div>
                                    <div className="frame__text">
                                        <label htmlFor="">Last Name</label>
                                        <div>
                                            <FormControl className={classes.inputStyle} variant="outlined">
                                                <OutlinedInput
                                                    inputProps={{ maxLength: 150 }}
                                                    ref={lnRef}
                                                    className={classes.inputStyle}
                                                    sx={{
                                                        width: '100%',
                                                        borderRadius: '0px !important',
                                                        background: '#f2f7fc',
                                                        height: 48,
                                                        border: `${`${
                                                            isValid.lastName ? 'none' : '2px solid red !important'
                                                        }`}`,
                                                        '& fieldset': { border: 'none' },
                                                        '& input:focus': {
                                                            border: 'none!important',
                                                        },
                                                    }}
                                                    size="small"
                                                    id="lastname-input"
                                                    endAdornment={<InputAdornment position="end"></InputAdornment>}
                                                    value={userInput.lastName}
                                                    onChange={(e) =>
                                                        setUserInput({ ...userInput, lastName: e.target.value })
                                                    }
                                                />
                                            </FormControl>
                                        </div>
                                    </div>
                                </div>
                                <div className="frame__under">
                                    <div className={clsx(classes.inputStyleLeft, 'frame__text frame_left')}>
                                        <label htmlFor="">Old Password</label>
                                        <div>
                                            <FormControl variant="outlined" className={classes.inputStyle}>
                                                <OutlinedInput
                                                    inputProps={{ maxLength: 150 }}
                                                    ref={opRef}
                                                    className={classes.inputStyle}
                                                    sx={{
                                                        width: '100%',
                                                        borderRadius: '0px !important',
                                                        background: '#f2f7fc',
                                                        height: 48,
                                                        border: `${`${
                                                            isValid.oldPassword ? 'none' : '2px solid red !important'
                                                        }`}`,
                                                        '& fieldset': { border: 'none' },
                                                        '& input:focus': {
                                                            border: 'none!important',
                                                        },
                                                    }}
                                                    size="small"
                                                    id="old-password"
                                                    autoComplete=""
                                                    onChange={(e) =>
                                                        setUserInput({ ...userInput, oldPassword: e.target.value })
                                                    }
                                                    type={showPasswordFirst ? 'text' : 'password'}
                                                    endAdornment={
                                                        <InputAdornment position="end">
                                                            <IconButton
                                                                aria-label="toggle password visibility"
                                                                onClick={handleClickShowPasswordFirst}
                                                                onMouseDown={handleMouseDownPassword}
                                                                edge="end"
                                                            >
                                                                {showPasswordFirst ? (
                                                                    <img src={Eye} alt="" />
                                                                ) : (
                                                                    <img src={EyeClose} alt="" />
                                                                )}
                                                            </IconButton>
                                                        </InputAdornment>
                                                    }
                                                />
                                            </FormControl>
                                        </div>
                                    </div>
                                    <div className="frame__text">
                                        <label htmlFor="">New Password</label>
                                        <div>
                                            <FormControl className={classes.inputStyle} variant="outlined">
                                                <OutlinedInput
                                                    inputProps={{ maxLength: 150 }}
                                                    ref={npRef}
                                                    className={classes.inputStyle}
                                                    sx={{
                                                        width: '100%',
                                                        borderRadius: '0px !important',
                                                        background: '#f2f7fc',
                                                        height: 48,
                                                        border: `${`${
                                                            isValid.newPassword ? 'none' : '2px solid red !important'
                                                        }`}`,
                                                        '& fieldset': { border: 'none' },
                                                        '& input:focus': {
                                                            border: 'none!important',
                                                        },
                                                    }}
                                                    size="small"
                                                    autoComplete=""
                                                    id="new-password"
                                                    onChange={(e) =>
                                                        setUserInput({ ...userInput, newPassword: e.target.value })
                                                    }
                                                    type={showPasswordSecond ? 'text' : 'password'}
                                                    endAdornment={
                                                        <InputAdornment position="end">
                                                            <IconButton
                                                                aria-label="toggle password visibility"
                                                                onClick={handleClickShowPasswordSecond}
                                                                onMouseDown={handleMouseDownPassword}
                                                                edge="end"
                                                            >
                                                                {showPasswordSecond ? (
                                                                    <img src={Eye} alt="" />
                                                                ) : (
                                                                    <img src={EyeClose} alt="" />
                                                                )}
                                                            </IconButton>
                                                        </InputAdornment>
                                                    }
                                                />
                                            </FormControl>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="frame__note"></div>
                        </Box>
                        <div className="account__save">
                            <button onClick={handleSubmit}>Save</button>
                        </div>
                    </div>
                    <div className="account__label">
                        <p>danger zone</p>
                    </div>
                    <div className="account__delete">
                        <div>Once you delete your account, it cannot be undone. This is permanent.</div>
                        <button onClick={() => setOpen(true)}>Delete Account</button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Account;
