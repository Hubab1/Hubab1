import { createSlice } from 'redux-starter-kit';

import API, { MOCKY } from 'app/api';
import mock from './mock-payments';

const payments = createSlice({
    slice: 'payments',
    initialState: null,
    reducers: {
        paymentsReceived(state, action) {
            state = action.payload;
            return state;
        }
    }
});

const { actions, reducer } = payments;
export const { paymentsReceived } = actions;
export default reducer;

export const fetchPayments = () => {
    return async dispatch => {
        let payments;
        if (MOCKY) {
            payments = mock.payables;
        } else {
            payments = await API.fetchPaymentOptions().payables;
        }
        dispatch(paymentsReceived(payments));
        return payments
    }
};

// selectors
export const selectors = {};
