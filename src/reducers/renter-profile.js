import { createSlice } from 'redux-starter-kit';
import uuidv4 from 'uuid/v4';
import produce from 'immer';
import { createSelector } from 'reselect';

import { NAV_ROUTES, routeToOptionName } from 'app/constants';
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


export const updateRenterProfile = (newData, stateUpdate=null) => {
    return dispatch => {
        if (MOCKY) {
            dispatch({
                type: renterProfileUpdated.toString(),
                payload: stateUpdate || newData
            });
            return Promise.resolve({});
        }
        return API.patchApplication(newData).then(res => {
            if (res.errors) {
                return res
            }
            return dispatch({
                type: renterProfileUpdated.toString(),
                payload: stateUpdate || newData
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
                return BASE_ROUTES.concat(addedRoutes).concat([ROUTES.INCOME_AND_EMPLOYMENT, ROUTES.FEES_AND_DEPOSITS, ROUTES.SCREENING, ROUTES.APP_COMPLETE])
            } else {
                return [ROUTES.PROFILE, ROUTES.INCOME_AND_EMPLOYMENT, ROUTES.FEES_AND_DEPOSITS, ROUTES.SCREENING, ROUTES.APP_COMPLETE]
            }
        }
    }
);

const PROFILE_FIELDS = ['address_street', 'address_city', 'address_state', 'address_postal_code', 'birthday'];

const routeMapping = (events, selectedRentalOptions, renterProfile, applicant) => ({
    [ROUTES.PROFILE]: !PROFILE_FIELDS.some((field) => !!applicant[field]), 
    [ROUTES.LEASE_TERMS]: !renterProfile.lease_term, 
    [ROUTES.PROFILE_OPTIONS]: !(events.has(APPLICATION_EVENTS.EVENT_RENTAL_OPTIONS_SELECTED) || events.has(APPLICATION_EVENTS.EVENT_RENTAL_OPTIONS_NOT_SELECTED)),
    [ROUTES.CO_APPLICANTS]: !events.has(APPLICATION_EVENTS.EVENT_RENTAL_OPTIONS_COAPPLICANT_INVITED) && selectedRentalOptions.has("co_applicants"),
    [ROUTES.GUARANTOR]: !events.has(APPLICATION_EVENTS.EVENT_RENTAL_OPTIONS_GUARANTOR_INVITED) && selectedRentalOptions.has("guarantor"),
    [ROUTES.PETS]: !events.has(APPLICATION_EVENTS.EVENT_RENTAL_OPTIONS_PET_ADDED) && selectedRentalOptions.has("pets"),
    [ROUTES.INCOME_AND_EMPLOYMENT]: !events.has(APPLICATION_EVENTS.EVENT_INCOME_REPORTS_GENERATED),
    [ROUTES.FEES_AND_DEPOSITS]: !events.has(APPLICATION_EVENTS.EVENT_APPLICATION_FEE_PAID),
    [ROUTES.SCREENING]: !events.has(APPLICATION_EVENTS.EVENT_SCREENING_COMPLETED),
    [ROUTES.APP_COMPLETE]: true
});

selectors.selectInitialPage = createSelector(
    selectors.selectOrderedRoutes,
    state => state.applicant && state.applicant.events,
    state => state.renterProfile && state.renterProfile.selected_rental_options,
    state => state.renterProfile,
    state => state.applicant,
    (orderedRoutes, events, selectedRentalOptions, renterProfile, applicant) => {
        if (orderedRoutes && events && selectedRentalOptions) {
            for (let i = 0; i < orderedRoutes.length; i++) {
                const route = orderedRoutes[i];
                const eventsSet = new Set(events.map(event => parseInt(event.event)));
                const selectedRentalOptionsSet = new Set(selectedRentalOptions);
                if (i === orderedRoutes.length -1 || routeMapping(eventsSet, selectedRentalOptionsSet, renterProfile, applicant)[route]) {
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

const shouldHideNavRouteIf = (selectedRentalOptions, applicantRole) => ({
    [ROUTES.PROFILE_OPTIONS]: applicantRole !== ROLE_PRIMARY_APPLICANT,
    [ROUTES.CO_APPLICANTS]: !selectedRentalOptions.has(routeToOptionName[ROUTES.CO_APPLICANTS]),
    [ROUTES.GUARANTOR]: !selectedRentalOptions.has(routeToOptionName[ROUTES.GUARANTOR]),
    [ROUTES.PETS]: !selectedRentalOptions.has(routeToOptionName[ROUTES.PETS]),
});

selectors.selectNav = createSelector(
    state => state.renterProfile && state.renterProfile.selected_rental_options,
    state => state.applicant && state.applicant.role,
    (selectedOptions, applicantRole) => {
        if (selectedOptions && applicantRole) {
            const selectedRentalOptionsSet = new Set(selectedOptions);
            const HIDE_ROUTE = shouldHideNavRouteIf(selectedRentalOptionsSet, applicantRole);
            function buildNav(routes) {
                const nav = [];
                // pick nav routes that can be shown
                for (let i = 0; i < routes.length; i++) {
                    const route = routes[i];
                    const copy = {};
                    // nav route can be shown
                    if (HIDE_ROUTE[route.value] !== true) {
                        copy.value = route.value;
                        copy.name = route.name;
                        nav.push(copy);
                    }
                    // build routes for route's subRoutes
                    if (copy && route.subRoutes) {
                        copy.subRoutes = buildNav(route.subRoutes);
                    }
                }
                return nav.length > 0 ? nav : null;
            }
            return buildNav(NAV_ROUTES) || [];
        }
    }
);