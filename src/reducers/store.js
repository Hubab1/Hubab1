import { configureStore } from 'redux-starter-kit';

import renterProfile from 'reducers/renter-profile';
import leaseSettings from 'reducers/configuration';

const reducer = {
    renterProfile,
    leaseSettings,
};

export default configureStore({
    reducer
});
