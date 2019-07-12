import { createSlice } from 'redux-starter-kit';
import produce from 'immer';

import API, { MOCKY } from 'app/api';
import mock from './applicant-mock';

const applicant = createSlice({
    slice: 'applicant',
    initialState: null,
    reducers: {
        applicantReceived(state, action) {
            state = action.payload;
            return state;
        },
        applicantUpdated(state, action) {
            const payload = action.payload;
            const newState = produce(state, draft => Object.assign({}, draft, payload))
            return newState;
        },
    },
    extraReducers: {
        USER_LOGOUT: () => {
            return null;
        }
    }
});

const { actions, reducer } = applicant;
export const { applicantUpdated, applicantReceived } = actions;
export default reducer;

export const fetchApplicant = () => {
    return async dispatch => {
        let applicant;
        if (MOCKY) {
            applicant = mock;
        } else {
            applicant = await API.fetchApplicant();
        }
        dispatch(applicantReceived(applicant));
        return applicant
    }
};

export const updateApplicant = (newData) => {
    return dispatch => {
        if (MOCKY) {
            dispatch({
                type: applicantUpdated.toString(),
                payload: newData
            });
            return Promise.resolve({});
        }
        return API.putApplicant(newData).then(res => {
            if (res.errors) {
                return res
            }
            return dispatch({
                type: applicantUpdated.toString(),
                payload: newData
            });
        })
    }
};

// selectors
export const selectors = {};