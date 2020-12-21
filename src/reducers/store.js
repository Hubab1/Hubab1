import { configureStore } from '@reduxjs/toolkit';
import ldRedux from 'ld-redux';

import renterProfile from 'reducers/renter-profile';
import configuration from 'reducers/configuration';
import siteConfig from 'reducers/site-config';
import applicant from 'reducers/applicant';
import payments from 'reducers/payments';

const reducer = {
    applicant,
    renterProfile,
    configuration,
    siteConfig,
    payments,
    launchDarkly: ldRedux.reducer(),
};

export const actions = {};

actions.logout = () => ({
    type: 'USER_LOGOUT',
});

export default configureStore({
    reducer,
});
