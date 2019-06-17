import { createSlice } from 'redux-starter-kit';
import { createSelector } from 'reselect';

import API from 'app/api';
import createTheme from 'assets/createTheme';

const configuration = createSlice({
    slice: 'configuration',
    initialState: null,
    reducers: {
        configurationReceived(state, action) {
            state = action.payload;
            state.dark = true
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
                return Object.assign(config, item)
            }, {});
        } else {
            configuration = await API.fetchConfiguration(communityId);
        }
        configuration.dark_mode = true;
        dispatch(configurationReceived(configuration));
        return configuration
    }
};

// selectors
export const selectors = {};
selectors.selectTheme = createSelector(
    state => state.configuration && state.configuration.primary_color,
    state => state.configuration && state.configuration.secondary_color,
    (primary_color, secondary_color) => {
        if (primary_color == null || secondary_color == null) return null;
        const primaryColor = `#${primary_color}`;
        const secondaryColor = `#${secondary_color}`;
        const theme = createTheme(primaryColor, secondaryColor);
        return theme;
    }
);