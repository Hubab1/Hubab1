import { MOCKY } from 'config';
import { ROUTES } from 'constants/constants';

// fetch middleware handles invalid token/expiry
export default async (...args) => {
    if (MOCKY) return Promise.reject();
    const res = await fetch(...args);
    if (res.headers.get('error_type') === 'TokenExpiredError') {
        if (localStorage.access_token) {
            localStorage.clear();
        }

        if (!window.location.href.includes('/login')) {
            const basename = window.location.pathname.split('/')[1];
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
};
