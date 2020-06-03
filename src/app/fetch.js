import { ROUTES } from 'app/constants';
import { MOCKY } from 'app/api';

// fetch middleware handles invalid token/expiry
export default async (...args) => {
    const res = await fetch(...args);
    if ( MOCKY ) return Promise.reject();
    if (res.headers.get('error_type') === 'TokenExpiredError') {
        if (localStorage.access_token) {
            localStorage.clear();
        }

        if (!window.location.href.includes('/login')) {
            const basename = window.location.pathname.split('/')[1];
            // TODO: should we use react-router to avoid full-page reload?
            window.location.href = `${window.location.origin}/${basename}${ROUTES.LOGIN}`;
        }
        return Promise.reject('TokenExpiredError');
    } else if (res.headers.get('error_type') === 'InvalidTokenError') {
        if (localStorage.access_token) {
            localStorage.clear();
        }

        if (!window.location.href.includes('/login')) {
            const basename = window.location.pathname.split('/')[1];
            window.location.href = `${window.location.origin}/${basename}${ROUTES.LOGIN}`;
        }
        return Promise.reject('InvalidTokenError');
    }
    return res;
}
