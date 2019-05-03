import { createSlice } from 'redux-starter-kit';

const siteConfig = createSlice({
    slice: 'renterProfile',
    initialState: {
        // basename equivalent to communityId
        basename: '',
        theme: null
    },
    reducers: {
        basenameReceived(state, action) {
            state.basename = action.payload;
            return state;
        },
        themeReceived(state, action) {
            state.theme = action.payload;
            return state;
        }
    }
});

const { actions, reducer } = siteConfig;
export const { basenameReceived, themeReceived } = actions;
export default reducer;