import store, { actions } from 'reducers/store';
import { ROUTES } from 'app/constants';

export default async (...args) => {
    const res = await fetch(...args);
    if (res.headers.get('error_type') === 'TokenExpiredError') {
        if (localStorage.access_token) {
            localStorage.clear();
        }
        store.dispatch(actions.logout());
        if (!window.location.href.includes('/login')) {
            window.location.href = `${window.location.origin}/${store.getState().siteConfig.basename}${ROUTES.LOGIN}`;
        }
        return Promise.reject('TokenExpiredError');
    }
    return res;
}
