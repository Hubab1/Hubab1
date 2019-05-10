import { createSlice } from 'redux-starter-kit';
import API from 'app/api';

const configuration = createSlice({
    slice: 'configuration',
    initialState: null,
    reducers: {
        configurationReceived(state, action) {
            state = action.payload;
            return state;
        }
    }
});

const { actions, reducer } = configuration;
export const { configurationReceived } = actions;
export default reducer;


// if you create LeaseSettings with community id 37 (excelsior), this hash will add a client and unit 'za7jDFkEML'

export const fetchConfiguration = (communityId, hash) => {
    return async dispatch => {
        let configuration = await API.fetchConfiguration(communityId, hash);
        let personalizedInfo = {};
        if (hash) {
            personalizedInfo = await API.fetchPersonalizedInfo(communityId, hash);
        }
        configuration = Object.assign({}, configuration, personalizedInfo);
        dispatch(configurationReceived(configuration));
        return configuration
    }
};