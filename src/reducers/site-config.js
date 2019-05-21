import { createSlice } from 'redux-starter-kit';

const siteConfig = createSlice({
    slice: 'renterProfile',
    initialState: {
        basename: '',
        theme: null,
        hash: null,
    },
    reducers: {
        basenameReceived(state, action) {
            state.basename = action.payload.basename;
            state.hash = action.payload.hash;
            return state;
        }
    }
});

const { actions, reducer } = siteConfig;
export const { basenameReceived } = actions;
export default reducer;