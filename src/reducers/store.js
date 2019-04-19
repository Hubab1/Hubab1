import { configureStore } from 'redux-starter-kit';

import renterProfile from './renterProfile/reducer';
import nav from './nav/reducer';

const reducer = {
  renterProfile,
  nav
};

export default configureStore({
    reducer
});