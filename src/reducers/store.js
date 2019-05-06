import { configureStore } from 'redux-starter-kit';

import renterProfile from 'reducers/renter-profile';
import configuration from 'reducers/configuration';

const reducer = {
    renterProfile,
    configuration,
};

export default configureStore({
    reducer
});
