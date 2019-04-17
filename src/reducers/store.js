import { configureStore } from 'redux-starter-kit';

import renterProfile from './renterProfile/renterProfile';

export default configureStore({
  reducer: {
    renterProfile
  }
});