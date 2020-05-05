import store, { actions } from 'reducers/store';
import { ROUTES } from 'app/constants';

// fetch middleware handles token expiry
export default async (...args) => {
    const res = await fetch(...args);
    if (res.headers.get('error_type') === 'TokenExpiredError') {
        if (localStorage.access_token) {
            localStorage.clear();
        }
        // may not be necessary right not due to full-page reload
        store.dispatch(actions.logout());

        if (!window.location.href.includes('/login')) {
            // TODO: should we use react-router to avoid full-page reload?
            window.location.href = `${window.location.origin}/${store.getState().siteConfig.basename}${ROUTES.LOGIN}`;
        }
        return Promise.reject('TokenExpiredError');
    }
    return res;
}
