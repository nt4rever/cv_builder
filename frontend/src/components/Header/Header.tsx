/* eslint-disable jsx-a11y/anchor-is-valid */
import { Link, useNavigate } from 'react-router-dom';
import React, { useEffect } from 'react';
import { makeStyles } from '@mui/styles';
import { useDispatch, useSelector } from 'react-redux';
import { Box, IconButton, Menu, MenuItem } from '@mui/material';
import './style.scss';
import Image from '@/assets/img/svg/image.svg';
import Logo from '@/assets/img/svg/logo_cv.svg';
import IconMenu from '@/assets/img/svg/iconMenu.svg';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import { logOut } from 'redux/userSlice';
import jwt_decode from 'jwt-decode';
import Avatar from 'react-avatar';

interface IToken {
    email: string;
    exp: number;
}

const useStyles = makeStyles((theme: any) => ({
    borderButton: {
        borderRadius: '0 !important',
        marginTop: '-13px !important',
        marginRight: '-8px !important',
    },
    liHover: {
        '&:hover': {
            background: 'none !important',
        },
    },

    aHover: {
        '@media (min-width: 415px) and  (max-width: 767px)': {
            padding: '10px 0 10px 10px !important',
        },
        '@media (min-width: 768px) and (max-width: 899px)': {
            padding: '10px 0 10px 65px !important',
        },
        '@media (max-width: 414px)': {
            padding: '10px 0 10px 10px !important',
        },
        '&:hover a': {
            color: '#2A3FFB !important',
        },
        '& a': {
            margin: '9px 10px 0 4px',
        },
        '& li': {
            paddingRight: '100px',
        },
    },
    infoUser: {
        display: 'flex',
        padding: '9px 16px 0 18px',
    },
}));

function Header() {
    const currentAccount = useSelector((state: any) => state?.user?.currentUser);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isActive, setIsActive] = React.useState<boolean>(false);
    const [isIconHidden, setIsIconHidden] = React.useState<boolean>(false);
    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const token = localStorage.getItem('access_token') || '';

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setIsActive(true);
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setIsActive(false);
        setAnchorEl(null);
    };

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
        setIsIconHidden(true);
    };
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
        setIsIconHidden(true);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
        setIsIconHidden(false);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
        setIsIconHidden(false);
    };

    const handleLogOut = () => {
        localStorage.removeItem('persist:root');
        localStorage.removeItem('currentUser');
        dispatch(logOut(currentAccount));
        navigate('/');
        window.location.reload();
    };

    if (token) {
        try {
            const decoded: IToken = jwt_decode(token);
            const expirationTime = decoded.exp * 1000;

            if (Date.now() > expirationTime) {
                handleLogOut();
            }
        } catch (error) {
            localStorage.clear();
            console.log(error);
        }
    }

    const changeHeaderBackground = () => {
        const header = document.querySelector('.header') as HTMLDivElement;
        window.scrollY >= 84 && window.innerWidth > 320
            ? (header.style.backgroundColor = '#F2F7FC')
            : (header.style.backgroundColor = 'none');
    };
    useEffect(() => {
        window.addEventListener('scroll', changeHeaderBackground);
        return () => window.removeEventListener('scroll', changeHeaderBackground);
    }, []);

    const removeDomainEmail = currentAccount?.user?.email.substring(0, currentAccount?.user?.email.lastIndexOf('@'));
    const name = `${currentAccount?.user?.firstName} ${currentAccount?.user?.lastName}`;
    const initials = `${name?.slice(0, 1)}${name?.slice(name.indexOf(' ') + 1, name.indexOf(' ') + 2)}`;
    const classes = useStyles();
    return (
        <div>
            <div className="header">
                <div>
                    <a href="/">
                        <img src={Logo} alt="" />
                    </a>
                </div>
                {!currentAccount ? (
                    <div className="header--right">
                        <Box
                            sx={{
                                display: { xs: 'flex', md: 'none' },
                            }}
                        >
                            <IconButton
                                size="large"
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleOpenNavMenu}
                                color="inherit"
                                sx={{ padding: 0 }}
                            >
                                {isIconHidden ? (
                                    <svg
                                        width="23"
                                        height="23"
                                        viewBox="0 0 20 18"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M14.9842 0.492073L9.63668 5.59683L4.28918 0.492073C3.63299 -0.134323 2.56869 -0.134323 1.91251 0.492073L0.724174 1.62646C0.06799 2.25286 0.06799 3.26885 0.724173 3.89524L6.07168 9L0.724173 14.1048C0.06799 14.7312 0.06799 15.7471 0.724174 16.3735L1.91251 17.5079C2.56869 18.1343 3.63299 18.1343 4.28918 17.5079L9.63668 12.4032L14.9842 17.5079C15.6404 18.1343 16.7047 18.1343 17.3609 17.5079L18.5492 16.3735C19.2054 15.7471 19.2054 14.7312 18.5492 14.1048L13.2017 9L18.5492 3.89524C19.2054 3.26885 19.2054 2.25286 18.5492 1.62646L17.3609 0.492073C16.7047 -0.134323 15.6404 -0.134324 14.9842 0.492073Z"
                                            fill="black"
                                        />
                                    </svg>
                                ) : (
                                    <FormatAlignLeftIcon />
                                )}
                            </IconButton>
                            <Menu
                                className={classes.liHover}
                                PaperProps={{
                                    elevation: 0,
                                    sx: {
                                        overflow: 'visible',
                                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                        backgroundColor: '#f2f7fc',
                                        left: '0 !important',
                                        width: '100% !important',
                                        boxShadow: 'none',
                                        WebkitFilter: 'none',
                                        height: '100%',
                                        top: '71px !important',
                                        margin: '0 !important',
                                        maxWidth: '100% !important',
                                    },
                                }}
                                id="menu-appbar"
                                anchorEl={anchorElNav}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}
                                open={Boolean(anchorElNav)}
                                onClose={handleCloseNavMenu}
                                sx={{
                                    display: { xs: 'block', md: 'none' },
                                }}
                            >
                                <MenuItem className={classes.aHover} onClick={handleCloseNavMenu}>
                                    <div className="list-items">
                                        <Link to="/template">
                                            <a className="list-items nav__templates" style={{ fontFamily: 'Inter' }}>
                                                Templates
                                            </a>
                                        </Link>
                                    </div>
                                </MenuItem>
                                <MenuItem className={classes.aHover} onClick={handleCloseNavMenu}>
                                    <div>
                                        <Link to="/login">
                                            <a className="list-items nav__login" style={{ fontFamily: 'Inter' }}>
                                                Login
                                            </a>
                                        </Link>
                                    </div>
                                </MenuItem>
                                {!currentAccount ? (
                                    <MenuItem>
                                        <div onClick={handleCloseNavMenu}>
                                            <div className="list-items" style={{ margin: 0 }}>
                                                <Link to="/login">
                                                    <button
                                                        type="submit"
                                                        style={{ fontFamily: 'Inter' }}
                                                        className="button button--primary"
                                                    >
                                                        Create Resume
                                                    </button>
                                                </Link>
                                            </div>
                                        </div>
                                    </MenuItem>
                                ) : (
                                    <MenuItem>
                                        <div onClick={handleCloseNavMenu}>
                                            <div className="list-items" style={{ margin: 0 }}>
                                                <Link to="/add-cv">
                                                    <button
                                                        type="submit"
                                                        style={{ fontFamily: 'Inter' }}
                                                        className="button button--primary"
                                                    >
                                                        Create Resume
                                                    </button>
                                                </Link>
                                            </div>
                                        </div>
                                    </MenuItem>
                                )}
                            </Menu>
                        </Box>
                        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
                            <Link to="/template">
                                <a className="list-items nav__templates">Templates</a>
                            </Link>

                            <Link to="/login">
                                <a className="list-items nav__login">Login</a>
                            </Link>
                            {!currentAccount ? (
                                <Link to="/login">
                                    <div onClick={handleCloseNavMenu}>
                                        <div className="list-items" style={{ margin: 0 }}>
                                            <button
                                                type="submit"
                                                style={{ fontFamily: 'Inter' }}
                                                className="button button--primary"
                                            >
                                                Create Resume
                                            </button>
                                        </div>
                                    </div>
                                </Link>
                            ) : (
                                <Link to="/add-cv">
                                    <div onClick={handleCloseNavMenu}>
                                        <div className="list-items" style={{ margin: 0 }}>
                                            <button
                                                type="submit"
                                                style={{ fontFamily: 'Inter' }}
                                                className="button button--primary"
                                            >
                                                Create Resume
                                            </button>
                                        </div>
                                    </div>
                                </Link>
                            )}
                        </Box>
                    </div>
                ) : (
                    <div className={`logged ${isActive ? 'logged__active' : ''}`}>
                        <Box
                            sx={{
                                display: { xs: 'flex', md: 'none' },
                            }}
                        >
                            <IconButton
                                size="large"
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleOpenUserMenu}
                                color="inherit"
                                sx={{ padding: 0 }}
                            >
                                {isIconHidden ? (
                                    <svg
                                        width="23"
                                        height="23"
                                        viewBox="0 0 20 18"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M14.9842 0.492073L9.63668 5.59683L4.28918 0.492073C3.63299 -0.134323 2.56869 -0.134323 1.91251 0.492073L0.724174 1.62646C0.06799 2.25286 0.06799 3.26885 0.724173 3.89524L6.07168 9L0.724173 14.1048C0.06799 14.7312 0.06799 15.7471 0.724174 16.3735L1.91251 17.5079C2.56869 18.1343 3.63299 18.1343 4.28918 17.5079L9.63668 12.4032L14.9842 17.5079C15.6404 18.1343 16.7047 18.1343 17.3609 17.5079L18.5492 16.3735C19.2054 15.7471 19.2054 14.7312 18.5492 14.1048L13.2017 9L18.5492 3.89524C19.2054 3.26885 19.2054 2.25286 18.5492 1.62646L17.3609 0.492073C16.7047 -0.134323 15.6404 -0.134324 14.9842 0.492073Z"
                                            fill="black"
                                        />
                                    </svg>
                                ) : (
                                    <Avatar
                                        name={initials}
                                        initials={initials}
                                        size="23"
                                        round={true}
                                        fgColor="#FFFFFF"
                                        textSizeRatio={0.75}
                                        color="#2A3FFB"
                                    />
                                )}
                            </IconButton>
                            <Menu
                                className={classes.liHover}
                                PaperProps={{
                                    elevation: 0,
                                    sx: {
                                        overflow: 'visible',
                                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                        backgroundColor: '#f2f7fc',
                                        left: '0 !important',
                                        width: '100% !important',
                                        boxShadow: 'none',
                                        WebkitFilter: 'none',
                                        height: '100%',
                                        top: '71px !important',
                                        margin: '0 !important',
                                        maxWidth: '100% !important',
                                    },
                                }}
                                id="menu-appbar"
                                anchorEl={anchorElUser}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}
                                open={Boolean(anchorElUser)}
                                onClose={handleCloseUserMenu}
                                sx={{
                                    display: { xs: 'block', md: 'none' },
                                }}
                            >
                                <MenuItem className={classes.aHover} onClick={handleCloseUserMenu}>
                                    <div id="123" className="list-setting">
                                        <Link to="/account">
                                            <a>Account Settings</a>
                                        </Link>
                                    </div>
                                </MenuItem>
                                <MenuItem className={classes.aHover} onClick={handleCloseUserMenu}>
                                    <div className="list-setting">
                                        <Link to="/dashboard">
                                            <a>Dashboard</a>
                                        </Link>
                                    </div>
                                </MenuItem>
                                <MenuItem
                                    className={classes.aHover}
                                    onClick={() => {
                                        handleCloseUserMenu();
                                        handleLogOut();
                                    }}
                                >
                                    <div className="list-setting" onClick={handleLogOut}>
                                        <Link to="/">
                                            <a>Log Out</a>
                                        </Link>
                                    </div>
                                </MenuItem>
                            </Menu>
                        </Box>
                        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
                            <React.Fragment>
                                <IconButton
                                    className={classes.borderButton}
                                    onClick={handleClick}
                                    aria-controls={open ? 'account-menu' : undefined}
                                    aria-haspopup="true"
                                    aria-expanded={open ? 'true' : undefined}
                                >
                                    <Avatar
                                        className="small-avatar"
                                        name={initials}
                                        initials={initials}
                                        size="25"
                                        round={true}
                                        fgColor="#FFFFFF"
                                        style={{
                                            border: 'none',
                                        }}
                                        color="#2A3FFB"
                                    />
                                    <a className="client-name">
                                        {`${currentAccount?.user?.firstName} ${currentAccount?.user?.lastName}`}
                                    </a>
                                    <img className="icon" src={IconMenu} alt="" />
                                </IconButton>
                                <Menu
                                    anchorEl={anchorEl}
                                    id="account-menu"
                                    open={open}
                                    onClose={handleClose}
                                    onClick={handleClose}
                                    PaperProps={{
                                        elevation: 0,

                                        sx: {
                                            overflow: 'visible',
                                            boxShadow: '0px 2px 2px rgba(15, 56, 113, 0.52)',
                                            borderRadius: '4px',
                                            mt: 5.7,
                                            ml: 5.1,
                                            top: '93px !important',
                                            right: 0,
                                            left: 'unset !important',
                                            marginRight: '40px !important',
                                            '& .MuiAvatar-root': {
                                                width: 32,
                                                height: 32,
                                                ml: -0.5,
                                                mr: 1,
                                            },
                                            '& .MuiList-root': {
                                                pb: 0.7,
                                            },
                                            '&:before': {
                                                content: '""',
                                                display: 'block',
                                                position: 'absolute',
                                                top: 0,
                                                right: 30,
                                                width: 10,
                                                height: 10,
                                                bgcolor: 'background.paper',
                                                transform: 'translateY(-50%) rotate(45deg)',
                                                zIndex: 0,
                                            },
                                        },
                                    }}
                                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                                >
                                    <div className={classes.infoUser}>
                                        <div className="avatar">
                                            <Avatar
                                                initials={initials}
                                                name={initials}
                                                size="45"
                                                round={true}
                                                textSizeRatio={0}
                                                fgColor="#FFFFFF"
                                                color="#2A3FFB"
                                            />
                                        </div>
                                        <div>
                                            <div className="gmail">
                                                {currentAccount?.user?.lastName === 'cv'
                                                    ? removeDomainEmail
                                                    : `${currentAccount?.user?.firstName} ${currentAccount?.user?.lastName}`}
                                            </div>
                                            <div className="gmail gmail--name">{currentAccount?.user?.email}</div>
                                        </div>
                                    </div>
                                    <Link to="/account">
                                        <MenuItem
                                            style={{
                                                paddingLeft: '14px',
                                                paddingRight: '67px',
                                                paddingTop: '9px',
                                                paddingBottom: '9px',
                                            }}
                                            className={classes.aHover}
                                            onClick={handleClose}
                                        >
                                            <div id="123" className="list-setting">
                                                <a>Account Settings</a>
                                            </div>
                                        </MenuItem>
                                    </Link>
                                    <Link to="/dashboard">
                                        <MenuItem
                                            style={{ paddingBottom: '15px' }}
                                            className={classes.aHover}
                                            onClick={handleClose}
                                        >
                                            <div className="list-setting">
                                                <a>Dashboard</a>
                                            </div>
                                        </MenuItem>
                                    </Link>
                                    <div className="list-setting">
                                        <hr />
                                    </div>

                                    <MenuItem
                                        className={classes.aHover}
                                        onClick={() => {
                                            handleClose();
                                            handleLogOut();
                                        }}
                                        style={{ marginBottom: '5px', paddingTop: '13px' }}
                                    >
                                        <div className="list-setting">
                                            <a>Log Out</a>
                                        </div>
                                    </MenuItem>
                                </Menu>
                            </React.Fragment>
                        </Box>
                    </div>
                )}
            </div>
        </div>
    );
}
export default Header;
