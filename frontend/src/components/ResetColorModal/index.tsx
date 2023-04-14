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

export const SaveButton = styled(Button)({
    boxShadow: 'none',
    textTransform: 'none',
    fontSize: 16,
    padding: '16px 22px',
    letterSpacing: '1.8px',
    lineHeight: '20px',
    borderRadius: '8px',
    fontWeight: '400',
    backgroundColor: '#2A3FFB',
    borderColor: '#2A3FFB',
    fontFamily: 'Fira Code',
    marginRight: '7px',
    transition: 'all 0.3s',
    '&:hover': {
        backgroundColor: '#2A3FFB',
        borderColor: '#2A3FFB',
        boxShadow: 'none',
        scale: '1.05',
    },
    '&:active': {
        boxShadow: 'none',
        backgroundColor: '#2A3FFB',
        borderColor: '#2A3FFB',
    },
});
export const LeaveButton = styled(Button)({
    boxShadow: 'none',
    textTransform: 'none',
    fontSize: 16,
    padding: '16px 22px',
    letterSpacing: '1.8px',
    lineHeight: '20px',
    borderRadius: '8px',
    fontWeight: '400',
    backgroundColor: '#fff',
    border: '1px solid #2A3FFB',
    fontFamily: 'Fira Code',
    color: '#2A3FFB',
    marginRight: '16px',
    '&:hover': {
        backgroundColor: '#f0f0f0',
        border: '1px solid #2A3FFB',
        boxShadow: 'none',
        color: '#2A3FFB',
    },
    '&:active': {
        boxShadow: 'none',
        backgroundColor: '#9c9c9c',
        borderColor: '#9c9c9c',
    },
});

interface IProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    task: () => void;
    onSave?: () => Promise<void>;
    btnContent: string;
}

function index({ open, task, setOpen, onSave, btnContent }: IProps) {
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
                Are You sure?
            </DialogTitle>
            <DialogContent className="deleteCv__items--content">
                <DialogContentText component="span" id="alert-dialog-description">
                    <Typography>
                        Are you want you sure to change color this section? <br></br>The color of the resume will be
                        restored
                    </Typography>
                </DialogContentText>
            </DialogContent>
            <DialogActions style={{ marginBottom: '42px' }}>
                <SaveButton
                    onClick={async () => {
                        setOpen(false);
                        onSave && (await onSave());
                        task();
                    }}
                    color="secondary"
                    variant="contained"
                >
                    {btnContent}
                </SaveButton>
                <LeaveButton
                    onClick={() => {
                        setOpen(false);
                    }}
                    color="primary"
                    variant="contained"
                    autoFocus
                >
                    Cancel
                </LeaveButton>
            </DialogActions>
        </Dialog>
    );
}

export default index;
