import { createSlice } from '@reduxjs/toolkit';

import API from 'api/api';

const banking = createSlice({
    name: 'banking',
    initialState: null,
    reducers: {
        bankingDataReceived(state, action) {
            state = action.payload;
            return state;
        },
        bankingDataCleared(state) {
            state = null;
            return state;
        },
    },
});

const { actions, reducer } = banking;
export const { bankingDataReceived, bankingDataCleared } = actions;
export default reducer;

export const refreshFinancialSources = () => {
    return async (dispatch) => {
        const response = await API.getFinancialSources();
        if (response.status === 200) {
            const data = await response.json();
            dispatch(bankingDataReceived(data));
            return data;
        }
    };
};

export const clearFinancialSources = () => {
    return async (dispatch) => {
        dispatch(bankingDataCleared());
    };
};
