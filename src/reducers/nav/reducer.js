import { createSlice } from 'redux-starter-kit';

const routes = {
    Terms: {next: 'Customize', back: 'Terms', buttonText: 'I Agree to the Terms & Conditions'},
    Customize: {next: 'Customize', back: 'Terms', buttonText: 'Continue'}
};

const nav = createSlice({
    slice: 'nav',
    initialState: {
        screen: null
    },
    reducers: {
        changeScreen(state, action) {
            state.screen = action.payload;
        },
        nextScreen(state, action) {
            const currentScreen = state.screen;
            state.screen = routes[currentScreen].next;
        }
    }
});

const { actions, reducer } = nav;
export const { nextScreen, changeScreen } = actions;
export default reducer;

export const selectors = {};
selectors.getCurrentScreen = state => routes[state.nav.screen] || {};