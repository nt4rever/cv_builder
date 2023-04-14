import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    DialogContentText,
    styled,
} from '@mui/material';

export const DeleteButton = styled(Button)({
    boxShadow: 'none',
    textTransform: 'none',
    fontSize: 16,
    padding: '16px 22px',
    letterSpacing: '1.8px',
    lineHeight: '20px',
    borderRadius: '8px',
    fontWeight: '400',
    backgroundColor: '#FB4458',
    borderColor: '#FB4458',
    fontFamily: 'Fira Code',
    marginRight: '7px',
    '&:hover': {
        backgroundColor: '#f5112a',
        borderColor: '#f5112a',
        boxShadow: 'none',
    },
    '&:active': {
        boxShadow: 'none',
        backgroundColor: '#f5112a',
        borderColor: '#f5112a',
    },
});
export const CancelButton = styled(Button)({
    boxShadow: 'none',
    textTransform: 'none',
    fontSize: 16,
    padding: '16px 22px',
    letterSpacing: '1.8px',
    lineHeight: '20px',
    borderRadius: '8px',
    fontWeight: '400',
    backgroundColor: '#D9D9D9',
    borderColor: '#D9D9D9',
    fontFamily: 'Fira Code',
    color: '#000000',
    marginRight: '16px',
    '&:hover': {
        backgroundColor: '#9c9c9c',
        borderColor: '#9c9c9c',
        boxShadow: 'none',
    },
    '&:active': {
        boxShadow: 'none',
        backgroundColor: '#9c9c9c',
        borderColor: '#9c9c9c',
    },
});

interface IProps {
    actionName: string;
    title: string;
    content: string;
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    task: () => void;
}

function index({ title, content, open, task, setOpen, actionName }: IProps) {
    return (
        <Dialog
            className="deleteCv__items"
            open={open}
            onClose={() => setOpen(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle
                id="alert-dialog-title"
                className="deleteCv__items--title"
                style={{
                    textAlign: 'center',
                    fontFamily: 'Fira Code',
                    margin: '50px 0px 15px 0px',
                    padding: '0px',
                    fontWeight: '700',
                    fontSize: '20px',
                    textTransform: 'uppercase',
                    letterSpacing: '1.8px',
                }}
            >
                {title}
            </DialogTitle>
            <DialogContent className="deleteCv__items--content">
                <DialogContentText component="span" id="alert-dialog-description">
                    <Typography>{content}</Typography>
                </DialogContentText>
            </DialogContent>
            <DialogActions style={{ marginBottom: '42px' }}>
                <DeleteButton
                    onClick={() => {
                        task();
                        setOpen(false);
                    }}
                    color="secondary"
                    variant="contained"
                >
                    {actionName}
                </DeleteButton>
                <CancelButton onClick={() => setOpen(false)} color="primary" variant="contained" autoFocus>
                    Cancel
                </CancelButton>
            </DialogActions>
        </Dialog>
    );
}

export default index;
