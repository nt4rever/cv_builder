import React from 'react';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { makeStyles, Snackbar } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { snackBarAction } from 'redux/SnackBar/slice';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="standard" {...props} />;
});

const useStyles = makeStyles((theme) => ({
    snackBarStyle: {
        top: '48px',
        zIndex: 10000,
    },
}));

export const SnackBarNotification = () => {
    const classes = useStyles();
    const { open, type, message, duration } = useSelector((state: any) => state.snackBar);
    const dispatch = useDispatch();
    const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        dispatch(snackBarAction.close());
    };
    return (
        <>
            <Snackbar
                open={open}
                autoHideDuration={duration}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                className={classes.snackBarStyle}
            >
                <Alert onClose={handleClose} severity={type}>
                    {message}
                </Alert>
            </Snackbar>
        </>
    );
};
