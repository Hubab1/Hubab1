import { createSlice } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';

import API, { MOCKY } from 'app/api';
import createTheme from 'assets/createTheme';
import mock from './mock-config';
import { DOES_NOT_EXIST } from 'app/constants';

const configuration = createSlice({
    name: 'configuration',
    initialState: {},
    reducers: {
        configurationReceived(state, action) {
            state = action.payload;
            state.dark = true;
            return state;
        },
        configurationDoesNotExist(state, action) {
            state = action.payload;
            return state;
        },
    },
});

const { actions, reducer } = configuration;
export const { configurationReceived, configurationDoesNotExist } = actions;
export default reducer;

export const fetchConfiguration = (communityId, hash) => {
    return async (dispatch) => {
        let configuration = {};
        if (hash) {
            if (MOCKY) {
                configuration = mock;
            } else {
                const data = await Promise.all([
                    API.fetchConfiguration(communityId),
                    API.fetchPersonalizedInfo(communityId, hash),
                ]);
                configuration = data.reduce((config, item) => {
                    return Object.assign(config, item);
                }, {});
            }
        } else {
            if (MOCKY) {
                configuration = mock;
            } else {
                configuration = await API.fetchConfiguration(communityId);
            }
        }
        if (configuration.error_type === DOES_NOT_EXIST) {
            dispatch(configurationDoesNotExist(configuration));
        } else {
            dispatch(configurationReceived(configuration));
        }
        return configuration;
    };
};

// selectors
export const selectors = {};
selectors.selectTheme = createSelector(
    (state) => state.configuration && state.configuration.primary_color,
    (state) => state.configuration && state.configuration.secondary_color,
    (primary_color, secondary_color) => {
        if (primary_color == null || secondary_color == null) return null;
        const primaryColor = `#${primary_color}`;
        const secondaryColor = `#${secondary_color}`;
        return createTheme(primaryColor, secondaryColor);
    }
);
