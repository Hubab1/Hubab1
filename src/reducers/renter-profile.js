import { createSlice} from 'redux-starter-kit';
import uuidv4 from 'uuid/v4';
import produce from 'immer';
import { createSelector } from 'reselect';

import API, { MOCKY } from 'app/api';
import { BASE_ROUTES, ROUTES, ROLE_PRIMARY_APPLICANT } from 'app/constants';
import mock from './mock-profile';

const renterProfile = createSlice({
    slice: 'renterProfile',
    initialState: null,
    reducers: {
        renterProfileReceived(state, action) {
            state = action.payload;
            if (state.pets) {
                state.pets.forEach(pet => pet.key = uuidv4());
            } else {
                state.pets = [{key: uuidv4()}];
            }
            return state;
        },
        renterProfileUpdated(state, action) {
            const payload = action.payload;
            const newState = produce(state, draft => Object.assign({}, draft, payload))
            return newState;
        },
    }
});

const { actions, reducer } = renterProfile;
export const { renterProfileReceived, renterProfileUpdated } = actions;
export default reducer;

export const fetchRenterProfile = () => {
    return async dispatch => {
        let profile;
        if (MOCKY) {
            profile = mock;
        } else {
            profile = await API.fetchRenterProfile();
        }
        dispatch(renterProfileReceived(profile));
        return profile;
    }
};


export const updateRenterProfile = (newData) => {
    return dispatch => {
        if (MOCKY) {
            dispatch({
                type: renterProfileUpdated.toString(),
                payload: newData
            });
            return Promise.resolve({});
        }
        return API.patchApplication(newData).then(res => {
            if (res.errors) {
                return res
            }
            return dispatch({
                type: renterProfileUpdated.toString(),
                payload: newData
            });
        })
    }
};

// selectors
export const selectors = {};
selectors.selectOrderedRoutes = createSelector(
    state => state.configuration && state.configuration.rental_options_config,
    state => state.renterProfile && state.renterProfile.selected_rental_options,
    state => state.applicant,
    (config, selectedOptions, applicant) => {
        if (selectedOptions && config && applicant) {
            if (applicant.role === ROLE_PRIMARY_APPLICANT) {
                const addedRoutes = [];
                // temp until api gives us an ordered configuration set
                Object.keys(config).forEach(key => {
                    if (selectedOptions.indexOf(key) > -1) {
                        addedRoutes.push(ROUTES[key.toUpperCase()]);
                    }
                })
                return BASE_ROUTES.concat(addedRoutes).concat([ROUTES.CONNECT_BANK, ROUTES.APPLICATION_FEE])
            } else {
                return [ROUTES.TELL_US_MORE, ROUTES.CONNECT_BANK, ROUTES.APPLICATION_FEE]
            }
        }
    }
);

const TELL_US_MORE_FIELDS = ['address_street', 'address_city', 'address_state', 'address_postal_code', 'birthday'];

const routeMapping = (profile, applicant) => ({
    [ROUTES.TELL_US_MORE]: !TELL_US_MORE_FIELDS.some((field) => !!applicant[field]),
    [ROUTES.PROFILE_OPTIONS]: profile.selected_rental_options == null || profile.selected_rental_options.length === 0,
    [ROUTES.CO_APPLICANTS]: !profile.co_applicants.length,
    [ROUTES.GUARANTOR]: !applicant.guarantors.length,
    [ROUTES.PETS]: !profile.pets,
});

selectors.selectInitialPage = createSelector(
    selectors.selectOrderedRoutes,
    state => state.renterProfile,
    state => state.applicant,
    (orderedRoutes, profile, applicant) => {
        if (orderedRoutes && profile && applicant) {
            for (let i = 0; i < orderedRoutes.length; i++) {
                const route = orderedRoutes[i];
                if (i === orderedRoutes.length -1 || routeMapping(profile, applicant)[route]) {
                    return route;
                }
            }
        }
    }
);

selectors.selectNextRoute = createSelector(
    selectors.selectOrderedRoutes,
    state => state.siteConfig.currentRoute,
    (orderedRoutes, currentRoute) => {
        if (orderedRoutes && currentRoute) {
            return orderedRoutes[orderedRoutes.indexOf(currentRoute)+1];
        }
    }
);

selectors.selectPrevRoute = createSelector(
    selectors.selectOrderedRoutes,
    state => state.siteConfig.currentRoute,
    (orderedRoutes, currentRoute) => {
        if (orderedRoutes && currentRoute) {
            return orderedRoutes[orderedRoutes.indexOf(currentRoute)-1];
        }
    }
);