import { configureStore } from 'redux-starter-kit';

import renterProfile from 'reducers/renter-profile';
import leaseSettings from 'reducers/lease-settings';
import siteConfig from 'reducers/site-config';

const reducer = {
    renterProfile,
    leaseSettings,
    siteConfig
};

export default configureStore({
    reducer
});
