import get from 'lodash/get';

import history from 'app/history';
import API, { MOCKY } from 'app/api';
import { setTokenHeader, clearTokenHeader } from 'utils/request';

// token auth service loosely based on the authentication service exemplified here: https://medium.appbase.io/how-to-implement-authentication-for-your-react-app-cf09eef3bb0b
class Auth {
    init = () => {
        const token = this.getToken();
        token && setTokenHeader(token);
    }

    register = (data, leaseSettingsId, clientId) => {
        return API.register(data, leaseSettingsId, clientId)
            .then((res) => {
                if (res.errors) {
                    return Promise.reject({ errors: res.errors });
                }

                const { token } = res;
                setTokenHeader(token);
                return Promise.resolve({ token });
            })
            .catch((e) => {
                const error = get(e, 'errors.error._schema[0]');
                const errorMsg = error || 'There was a problem creating your account.';

                return Promise.reject({ errors: { error: errorMsg } });
            });
    };

    login = (email, password, communityId) => {
        if (MOCKY) {
            return Promise.resolve({ token: 'FAKETOKEN' });
        }
        return API.login(email, password, communityId).then((res) => {
            if (res.errors) return Promise.reject({ errors: res.errors });
            const { token } = res;
            setTokenHeader(token);
            return Promise.resolve({ token });
        });
    };

    getToken = () => {
        return localStorage?.getItem('access_token');
    };

    accessScope = () => {
        return localStorage?.getItem('access_scope');
    };

    setSession = (authToken, scope) => {
        const nowPlus30Days = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).getTime();
        localStorage.setItem('expires_at', nowPlus30Days);
        localStorage.setItem('access_token', authToken);
        localStorage.setItem('access_scope', scope);
    };

    logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('expires_at');
        history.push('/login');
        clearTokenHeader();
    };

    isAuthenticated = () => {
        const expiresAt = JSON.parse(localStorage?.getItem('expires_at'));
        return new Date().getTime() < expiresAt;
    };
}

export default new Auth();
