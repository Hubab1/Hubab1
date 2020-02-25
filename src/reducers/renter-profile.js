import { createSlice } from 'redux-starter-kit';
import uuidv4 from 'uuid/v4';
import produce from 'immer';
import { createSelector } from 'reselect';

import { NAV_ROUTES } from 'app/constants';
import API, { MOCKY } from 'app/api';
import {
    BASE_ROUTES, ROUTES, ROLE_PRIMARY_APPLICANT, APPLICATION_EVENTS, MILESTONE_APPLICATION_SUBMITTED,
    APPLICATION_APPROVED_STATUSES,
} from 'app/constants';
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
            const newState = produce(state, draft => Object.assign({}, draft, payload));
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
                payload: stateUpdate || res
            });
        })
    }
};

export const pageComplete = (page) => {
    return dispatch => {
        return API.postPageComplete(page).then(() => {
            dispatch(fetchRenterProfile());
        })
    }
};

// selectors
export const selectors = {};
selectors.selectOrderedRoutes = createSelector(
    state => state.applicant,
    (applicant) => {
        if (applicant) {
            if (applicant.role === ROLE_PRIMARY_APPLICANT) {
                return BASE_ROUTES.concat([
                    ROUTES.APP_APPROVED,
                    ROUTES.INCOME_AND_EMPLOYMENT,
                    ROUTES.FEES_AND_DEPOSITS,
                    ROUTES.SCREENING,
                    ROUTES.APP_COMPLETE,
                ])
            } else {
                return [
                    ROUTES.APP_APPROVED,
                    ROUTES.ADDRESS,
                    ROUTES.LEASE_TERMS,
                    ROUTES.INCOME_AND_EMPLOYMENT,
                    ROUTES.FEES_AND_DEPOSITS,
                    ROUTES.SCREENING,
                    ROUTES.APP_COMPLETE,
                ]
            }
        }
    }
);

const ADDRESS_FIELDS = ['address_street', 'address_city', 'address_state', 'address_postal_code'];

const routeMapping = (events, applicant, profile) => ({
    [ROUTES.ADDRESS]: !ADDRESS_FIELDS.some((field) => !!applicant[field]),
    [ROUTES.LEASE_TERMS]: !APPLICATION_EVENTS.EVENT_LEASE_TERMS_COMPLETED,
    [ROUTES.PROFILE_OPTIONS]: !(events.has(APPLICATION_EVENTS.EVENT_RENTAL_OPTIONS_SELECTED) || events.has(APPLICATION_EVENTS.EVENT_RENTAL_OPTIONS_NOT_SELECTED)),
    [ROUTES.INCOME_AND_EMPLOYMENT]: !events.has(APPLICATION_EVENTS.EVENT_INCOME_REPORTS_GENERATED),
    [ROUTES.FEES_AND_DEPOSITS]: !applicant.receipt, //  TODO: maybe change this back to using events when we create paid events other people paying for roommates/guarantors !events.has(APPLICATION_EVENTS.EVENT_APPLICATION_FEE_PAID),
    [ROUTES.SCREENING]: !events.has(MILESTONE_APPLICATION_SUBMITTED),
    [ROUTES.APP_COMPLETE]: true,
    [ROUTES.ACCOUNT]: false,
    [ROUTES.APP_APPROVED]: profile && APPLICATION_APPROVED_STATUSES.includes(profile.status),
});

selectors.canAccessRoute = (state, route) => {
    const eventsSet = new Set(state.applicant.events.map(event => parseInt(event.event)));
    return routeMapping(eventsSet, state.applicant, state.renterProfile)[route] === false;
};

selectors.selectInitialPage = createSelector(
    selectors.selectOrderedRoutes,
    state => state.applicant && state.applicant.events,
    state => state.applicant,
    state => state.renterProfile,
    (orderedRoutes, events, applicant, profile) => {
        if (orderedRoutes && events) {
            const eventsSet = new Set(events.map(event => parseInt(event.event)));
            const accessibleRoutes = routeMapping(eventsSet, applicant, profile);

            const route = orderedRoutes.find(r => accessibleRoutes[r]);
            return route ? route : orderedRoutes[orderedRoutes.length - 1];
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

const shouldHideNavRouteIf = (applicantRole) => ({
    [ROUTES.PROFILE_OPTIONS]: applicantRole !== ROLE_PRIMARY_APPLICANT,
});

selectors.selectNav = createSelector(
    state => state.applicant && state.applicant.role,
    (applicantRole) => {
        if (applicantRole) {
            const HIDE_ROUTE = shouldHideNavRouteIf(applicantRole);
            function buildNav(routes) {
                const nav = [];
                // pick nav routes that can be shown to current user
                for (let i = 0; i < routes.length; i++) {
                    const route = routes[i];
                    // nav route can be shown
                    if (HIDE_ROUTE[route.value] !== true) {
                        nav.push({
                            name: route.name,
                            value: route.value
                        });
                    }
                }
                return nav.length > 0 ? nav : null;
            }
            return buildNav(NAV_ROUTES) || [];
        }
    }
);
