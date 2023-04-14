import { getInformationCv } from './action';
import { createSlice } from '@reduxjs/toolkit';
import { ActionGetInformation, InitialStateInformations } from './types';

const initialState: InitialStateInformations = {};

const addCvSlice = createSlice({
    name: 'informationCv',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getInformationCv.fulfilled, (state: InitialStateInformations, action: ActionGetInformation) => {
            if (action.payload) {
                state.informations = action.payload;
            }
        });
    },
});
export default addCvSlice.reducer;
