import { createSlice } from 'redux-starter-kit';
import produce from "immer";
import API from 'app/api';

const renterProfile = createSlice({
    slice: 'renterProfile',
    initialState: null,
    reducers: {
        renterProfileReceived(state, action) {
            debugger;
            state = action.payload;
            return state;
        },
        renterProfileUpdated(state, action) {
            const payload = action.payload;
            debugger;
            return produce(state, draft => {
                Object.keys(payload).forEach(key => {
                    draft[key] = payload[key];
                });
                return draft;
            });
        },
    }
});

const { actions, reducer } = renterProfile;
export const { renterProfileReceived, renterProfileUpdated } = actions;
export default reducer;

export const fetchRenterProfile = () => {
    return async dispatch => {
        const profile = await API.fetchRenterProfile();
        return dispatch(renterProfileReceived(profile));
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
