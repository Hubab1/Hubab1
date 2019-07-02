import { createSlice } from 'redux-starter-kit';

import API from 'app/api';

const applicant = createSlice({
    slice: 'applicant',
    initialState: null,
    reducers: {
        applicantReceived(state, action) {
            state = action.payload;
            return state;
        }
    }
});

const { actions, reducer } = applicant;
export const { applicantReceived } = actions;
export default reducer;

export const fetchApplicant = () => {
    return async dispatch => {
        const applicant = await API.fetchApplicant();
        dispatch(applicantReceived(applicant));
        return applicant
    }
};

// selectors
export const selectors = {};