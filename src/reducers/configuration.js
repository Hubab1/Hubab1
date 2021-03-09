import { createSlice } from '@reduxjs/toolkit';
import _ from 'lodash';

import { MOCKY } from 'config';
import { DOES_NOT_EXIST } from 'constants/constants';
import API from 'api/api';
import { createTheme } from 'assets/theme';
import mock from './tests/mock-config';

const configuration = createSlice({
    name: 'configuration',
    initialState: {},
    reducers: {
        configurationReceived(state, action) {
            state = action.payload;
            return state;
        },
        configurationDoesNotExist(state, action) {
            state = action.payload;
            return state;
        },
        filterRentalOptionsByUnit(state, action) {
            const unit = action.payload.unit;
            if (unit) {
                const rentalOptions = {};
                for (const rental_key in state.rental_options) {
                    const options = state.rental_options[rental_key].filter((option) => {
                        return !option.layouts.length || option.layouts.includes(unit.layout);
                    });
                    if (options.length) {
                        rentalOptions[rental_key] = options;
                    }
                }
                state.rental_options = rentalOptions;
            }
            return state;
        },
    },
});

const { actions, reducer } = configuration;
export const { configurationReceived, configurationDoesNotExist, filterRentalOptionsByUnit } = actions;
export default reducer;

// Removes object properties that have empty object values
const removeEmptyObjects = (obj) => {
    return _.omitBy(obj, (v) => {
        return _.isEmpty(v) && _.isObject(v);
    });
};

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
                    // Needed because we sometimes receive empty client, person, or invitee objects
                    const itemWithoutEmptyObjects = removeEmptyObjects(item);
                    return Object.assign(config, itemWithoutEmptyObjects);
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
selectors.selectTheme = (state) => createTheme(state.configuration);
selectors.selectCommunity = (state) => state.configuration?.community;
selectors.selectCommunityContactPhoneNumber = (state) => state.configuration?.community?.contact_phone;
