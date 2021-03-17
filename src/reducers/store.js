import { configureStore } from '@reduxjs/toolkit';
import ldRedux from 'ld-redux';

import renterProfile from 'reducers/renter-profile';
import configuration from 'reducers/configuration';
import siteConfig from 'reducers/site-config';
import applicant from 'reducers/applicant';
import payments from 'reducers/payments';
import banking from 'reducers/banking';
import loader from 'reducers/loader';

const reducer = {
    applicant,
    renterProfile,
    configuration,
    siteConfig,
    payments,
    loader,
    launchDarkly: ldRedux.reducer(),
    banking,
};

export const actions = {};

actions.logout = () => ({
    type: 'USER_LOGOUT',
});

export default configureStore({
    reducer,
});
