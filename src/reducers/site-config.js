import { createSlice } from 'redux-starter-kit';

const siteConfig = createSlice({
    slice: 'renterProfile',
    initialState: {
        basename: '',
        theme: null
    },
    reducers: {
        basenameReceived(state, action) {
            state.basename = action.payload;
            return state;
        }
    }
});

const { actions, reducer } = siteConfig;
export const { basenameReceived } = actions;
export default reducer;