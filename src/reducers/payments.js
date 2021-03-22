import { createSlice } from '@reduxjs/toolkit';

import API from 'api/api';
import { MOCKY } from 'config';
import mock from './fixtures/mock-payments';

const payments = createSlice({
    name: 'payments',
    initialState: null,
    reducers: {
        paymentsReceived(state, action) {
            state = action.payload;
            return state;
        },
    },
});

const { actions, reducer } = payments;
export const { paymentsReceived } = actions;
export default reducer;

export const fetchPayments = () => {
    return async (dispatch, getState) => {
        const { renterProfile } = getState();
        console.log({ getState: getState(), renterProfile });
        let payments;
        if (MOCKY) {
            payments = mock;
        } else {
            payments = await API.fetchPaymentOptions(renterProfile.id);
        }
        dispatch(paymentsReceived(payments.payables));
        return payments.payables;
    };
};

// selectors
export const selectors = {};
