import { configureStore } from 'redux-starter-kit';

import renterProfile from 'reducers/renter-profile';
import configuration from 'reducers/configuration';
import siteConfig from 'reducers/site-config';

const reducer = {
    renterProfile,
    configuration,
    siteConfig
};

export default configureStore({
    reducer
});
