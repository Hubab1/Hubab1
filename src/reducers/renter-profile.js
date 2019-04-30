import { createSlice } from 'redux-starter-kit';

import API from 'api.js';

const renterProfile = createSlice({
    slice: 'renterProfile',
    initialState: null,
    reducers: {
        renterProfileReceived(state, action) {
            state = action.payload;
            return state;
        }
    }
});

const { actions, reducer } = renterProfile;
export const { renterProfileReceived } = actions;
export default reducer;

export const fetchRenterProfile = () => {
    return async dispatch => {
        const profile = await API.fetchRenterProfile();
        return dispatch(renterProfileReceived(profile));
    }
};
