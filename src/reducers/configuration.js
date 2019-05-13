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

export const fetchConfiguration = (communityId, hash) => {
    return async dispatch => {
        let configuration = {};
        if (hash) {
            const data = await Promise.all([API.fetchConfiguration(communityId), API.fetchPersonalizedInfo(communityId, hash)])
            configuration = data.reduce((config, item) => {
                return Object.assign({}, config, item)
            }, {});
        } else {
            configuration = await API.fetchConfiguration(communityId);
        }
        dispatch(configurationReceived(configuration));
        return configuration
    }
};