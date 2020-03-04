import { createSlice } from '@reduxjs/toolkit';

const siteConfig = createSlice({
    name: 'renterProfile',
    initialState: {
        basename: '',
        theme: null,
        hash: null,
        currentRoute: null
    },
    reducers: {
        basenameReceived(state, action) {
            state.basename = action.payload.basename;
            state.hash = action.payload.hash;
            return state;
        },
        currentRouteReceived(state, action) {
            state.currentRoute = action.payload;
            return state;
        }
    }
});

const { actions, reducer } = siteConfig;
export const { basenameReceived, currentRouteReceived } = actions;
export default reducer;
