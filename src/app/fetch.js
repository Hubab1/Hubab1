import { ROUTES } from 'app/constants';

// fetch middleware handles token expiry
export default async (...args) => {
    const res = await fetch(...args);
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
    }
    return res;
}
