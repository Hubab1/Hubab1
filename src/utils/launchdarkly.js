import ldRedux from 'ld-redux';
import uuidv4 from 'uuid/v4';

import store from 'reducers/store';

const flags = {
    'agent-request-more-income-when-no-income': true,
    'ol-show-automated-address-form': true,
};

export const initLaunchDarkly = (company = {}) => {
    ldRedux.init({
        clientSideId: process.env.REACT_APP_LD_CLIENT_KEY,
        dispatch: store.dispatch,
        flags,
        user: {
            key: uuidv4(),
            custom: {
                company_id: company.id,
            },
        },
    });
};
