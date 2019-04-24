import { configureStore } from 'redux-starter-kit';

import renterProfile from 'reducers/renter-profile';
import leaseSettings from 'reducers/lease-settings';

const reducer = {
  renterProfile,
  leaseSettings,
};

export default configureStore({
    reducer
});
