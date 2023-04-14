import { createSlice } from '@reduxjs/toolkit';

interface Action {
    type: string;
    payload: any;
}

export interface SnackBarState {
    open: boolean;
    type: string;
    message?: string;
    duration: number;
}

const initialState: SnackBarState = {
    open: false,
    type: 'success',
    message: '',
    duration: 5000,
};

const snackBarSlice = createSlice({
    name: 'snackBar',
    initialState,
    reducers: {
        open(state, action: Action) {
            state.open = true;
            state.message = action.payload?.message;
            state.type = action.payload?.type;
            state.duration = action.payload?.duration ? action.payload?.duration : state.duration;
            return state;
        },
        close(state) {
            state.open = false;
            return state;
        },
    },
});

export const snackBarAction = snackBarSlice.actions;

const snackBarReducer = snackBarSlice.reducer;
export default snackBarReducer;
