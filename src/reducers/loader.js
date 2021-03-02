import { createReducer } from '@reduxjs/toolkit';

export const TOGGLE_LOADER = 'loader/toggleLoader';

export const toggleLoader = (isVisible) => (dispatch) => {
    dispatch({
        type: TOGGLE_LOADER,
        payload: isVisible,
    });
};

export const actions = {
    toggleLoader,
};

const initialState = {
    isVisible: false,
};

export default createReducer(initialState, {
    [TOGGLE_LOADER]: (state, { payload: isVisible }) => ({
        isVisible: isVisible,
    }),
});

export const selectors = {};
selectors.getIsVisible = (state) => state.loader.isVisible;
