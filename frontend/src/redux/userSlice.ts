import { createSlice } from '@reduxjs/toolkit';

const currentUser = localStorage.getItem('currentUser') !== null ?? null;

const initialState = {
    currentUser: currentUser,
    users: [],
};

const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        login: (state, action) => {
            state.currentUser = action.payload;
            localStorage.setItem('currentUser', JSON.stringify(state.currentUser));
            localStorage.setItem('access_token', action.payload?.access_token);
            localStorage.setItem('refresh_token', action.payload?.refresh_token);
        },
        logOut: (state: any, action) => {
            state.currentUser = null;
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.setItem('currentUser', JSON.stringify(state.currentUser));
        },
        update: (state, action) => {
            state.currentUser = action.payload;
            localStorage.setItem('currentUser', JSON.stringify(state.currentUser));
        },
    },
});

export const { login, logOut, update } = userSlice.actions;
export default userSlice.reducer;
