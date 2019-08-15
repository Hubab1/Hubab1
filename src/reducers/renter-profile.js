import { createSlice } from 'redux-starter-kit';
import uuidv4 from 'uuid/v4';
import produce from 'immer';
import { createSelector } from 'reselect';

import API, { MOCKY } from 'app/api';
import { BASE_ROUTES, ROUTES, ROLE_PRIMARY_APPLICANT, APPLICATION_EVENTS } from 'app/constants';
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
    },
    extraReducers: {
        USER_LOGOUT: () => {
            return null;
        }
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
                Object.keys(config).forEach(key => {
                    if (selectedOptions.indexOf(key) > -1) {
                        addedRoutes.push(ROUTES[key.toUpperCase()]);
                    }
                })
                return BASE_ROUTES.concat(addedRoutes).concat([ROUTES.CONNECT_BANK, ROUTES.PAYMENT_OPTIONS, ROUTES.APPLICATION_FEE, ROUTES.FINAL_DETAILS, ROUTES.APP_STATUS])
            } else {
                return [ROUTES.TELL_US_MORE, ROUTES.CONNECT_BANK, ROUTES.PAYMENT_OPTIONS, ROUTES.APPLICATION_FEE, ROUTES.FINAL_DETAILS, ROUTES.APP_STATUS]
            }
        }
    }
);

const findEvent = (events, eventType) => events.find( event => event.event === String(eventType))

const routeMapping = (events, selectedRentalOptions) => ({
    [ROUTES.LEASE_TERMS]: false, // TODO: update when we have event for completed lease terms
    [ROUTES.TELL_US_MORE]: false, // TODO: update when we have event for completed MORE INFO PAGE
    [ROUTES.PROFILE_OPTIONS]: !(findEvent(events, APPLICATION_EVENTS.EVENT_RENTAL_OPTIONS_SELECTED) || findEvent(events, APPLICATION_EVENTS.EVENT_RENTAL_OPTIONS_NOT_SELECTED)),
    [ROUTES.CO_APPLICANTS]: !findEvent(events, APPLICATION_EVENTS.EVENT_RENTAL_OPTIONS_COAPPLICANT_INVITED) && selectedRentalOptions.find(option => option === "co_applicants"),
    [ROUTES.GUARANTOR]: !findEvent(events, APPLICATION_EVENTS.EVENT_RENTAL_OPTIONS_GUARANTOR_INVITED) && selectedRentalOptions.find(option => option === "guarantor"),
    [ROUTES.PETS]: !findEvent(events, APPLICATION_EVENTS.EVENT_RENTAL_OPTIONS_PET_ADDED) && selectedRentalOptions.find(option => option === "pets"),
    [ROUTES.CONNECT_BANK]: !findEvent(events, APPLICATION_EVENTS.EVENT_INCOME_REPORTS_GENERATED),
    [ROUTES.PAYMENT_OPTIONS]: !findEvent(events, APPLICATION_EVENTS.EVENT_APPLICATION_FEE_PAID),
    [ROUTES.FINAL_DETAILS]: false, // TODO: not sure if we should just delete this or what? 
    [ROUTES.APP_STATUS]: true
});

selectors.selectInitialPage = createSelector(
    selectors.selectOrderedRoutes,
    state => state.applicant && state.applicant.events,
    state => state.renterProfile && state.renterProfile.selected_rental_options,
    (orderedRoutes, events, selectedRentalOptions) => {
        if (orderedRoutes && events && selectedRentalOptions) {
            for (let i = 0; i < orderedRoutes.length; i++) {
                const route = orderedRoutes[i];
                if (i === orderedRoutes.length -1 || routeMapping(events, selectedRentalOptions)[route]) {
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