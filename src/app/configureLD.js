import ldRedux from 'ld-redux';

import store from 'reducers/store';

const flags = {
    'agent-request-more-income-when-no-income': false,
};

ldRedux.init({
    clientSideId: process.env.REACT_APP_LD_CLIENT_KEY,
    dispatch: store.dispatch,
    flags,
});
