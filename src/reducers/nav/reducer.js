import { createSlice } from 'redux-starter-kit';

import { ALL_ROUTES } from 'constants.js';

//TODO: add logic here that will determine next screen based on all routes, application config, and what was selected on RenterProfileOptions

const routes = {
    Terms: {next: 'RenterProfileOptions', back: 'Terms', buttonText: 'I Agree to the Terms & Conditions', url: '/terms'},
    RenterProfileOptions: {next: 'RenterProfileOptions', back: 'Terms', buttonText: 'Continue', url: 'profile'}
};

const nav = createSlice({
    slice: 'nav',
    initialState: {
        isLoggedIn: false
    },
    reducers: {
        nextScreen(state, action) {
            const currentScreen = state.screen;
            state.screen = routes[currentScreen].next;
        },
    }
});

const { actions, reducer } = nav;
export const { nextScreen } = actions;
export default reducer;

export const selectors = {};
selectors.getCurrentScreen = state => routes[state.nav.screen] || {};
