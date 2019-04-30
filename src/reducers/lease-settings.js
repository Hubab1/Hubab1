import { createSlice } from 'redux-starter-kit';
import API from 'api.js';

const leaseSettings = createSlice({
    slice: 'leaseSettings',
    initialState: null,
    reducers: {
        leaseSettingsReceived(state, action) {
            state = action.payload;
            return state;
        }
    }
});

const { actions, reducer } = leaseSettings;
export const { leaseSettingsReceived } = actions;
export default reducer;


export const fetchLeaseSettings = () => {
    return async dispatch => {
        const leaseSettings = await API.fetchLeaseSettings();
        dispatch(leaseSettingsReceived(leaseSettings));
        return leaseSettings
    }
};
