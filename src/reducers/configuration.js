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


export const fetchConfiguration = () => {
    return async dispatch => {
        const configuration = await API.fetchConfiguration();
        dispatch(configurationReceived(configuration));
        return configuration
    }
};
