import { createSlice } from '@reduxjs/toolkit';
import produce from 'immer';

import { MOCKY } from 'config';
import API from 'api/api';
import mock from './fixtures/mock-applicant';

const applicant = createSlice({
    name: 'applicant',
    initialState: null,
    reducers: {
        applicantReceived(state, action) {
            state = action.payload;
            return state;
        },
        applicantUpdated(state, action) {
            return produce(state, (draft) => {
                Object.assign(draft, action.payload);
            });
        },
    },
    extraReducers: {
        USER_LOGOUT: () => {
            return null;
        },
    },
});

const { actions, reducer } = applicant;
export const { applicantUpdated, applicantReceived } = actions;
export default reducer;

export const fetchApplicant = () => {
    return async (dispatch) => {
        let applicant;
        if (MOCKY) {
            applicant = mock;
        } else {
            applicant = await API.fetchApplicant();
        }
        dispatch(applicantReceived(applicant));
        return applicant;
    };
};

export const updateApplicant = (newData) => {
    return (dispatch) => {
        if (MOCKY) {
            dispatch(applicantUpdated(newData));
            return Promise.resolve({});
        }
        return API.putApplicant(newData).then((res) => {
            if (res.errors) {
                return res;
            }
            return dispatch(applicantUpdated(res));
        });
    };
};

// selectors
export const selectors = {};
