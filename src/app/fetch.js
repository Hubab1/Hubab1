import store, { actions } from 'reducers/store';
import { ROUTES } from 'app/constants';

export default async (...args) => {
    const res = await fetch(...args);
    if (res.headers.get('error_type') === 'TokenExpiredError' && (localStorage.access_token || !window.location.href.includes('/login'))) {
        localStorage.clear();
        store.dispatch(actions.logout());
        window.location.href = `${window.location.origin}/${store.getState().siteConfig.basename}${ROUTES.LOGIN}`;
        return Promise.reject('TokenExpiredError');
    }
    return res;
}
