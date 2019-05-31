import { createSlice } from 'redux-starter-kit';
import produce from "immer";
import { createSelector } from 'reselect';
import API from 'app/api';
import { BASE_ROUTES, ROUTES } from 'app/constants';

const renterProfile = createSlice({
    slice: 'renterProfile',
    initialState: null,
    reducers: {
        renterProfileReceived(state, action) {
            state = action.payload;
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
        const profile = await API.fetchRenterProfile();
        dispatch(renterProfileReceived(profile));
        return profile;
    }
};


export const updateRenterProfile = (newData) => {
    API.updateRenterProfile(newData);
    // optimistic update
    return {
        type: renterProfileUpdated.toString(),
        payload: newData
    }
};

// selectors
export const selectors = {};
selectors.selectOrderedRoutes = createSelector(
    state => state.configuration && state.configuration.rental_options_config,
    state => state.renterProfile && state.renterProfile.selected_rental_options,
    (config, selectedOptions) => {
        if (selectedOptions && config) {
            const addedRoutes = [];
            // temp until api gives us an ordered configuration set
            Object.keys(config).forEach(key => {
                if (selectedOptions.indexOf(key) > -1) {
                    addedRoutes.push(ROUTES[key.toUpperCase()]);
                }
            })
            return BASE_ROUTES.concat(addedRoutes)
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