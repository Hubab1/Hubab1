import { configureStore } from 'redux-starter-kit';

import renterProfile from 'reducers/renter-profile';
import configuration from 'reducers/configuration';
import siteConfig from 'reducers/site-config';
import applicant from 'reducers/applicant';

const reducer = {
    applicant,
    renterProfile,
    configuration,
    siteConfig
};

export const actions = {};
actions.logout = () => ({
    type: 'USER_LOGOUT'
})

export default configureStore({
    reducer
});
