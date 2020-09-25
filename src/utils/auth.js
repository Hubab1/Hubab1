import get from 'lodash/get';

import history from 'app/history';
import API, { MOCKY } from 'app/api';

// token auth service loosely based on the authentication service exemplified here: https://medium.appbase.io/how-to-implement-authentication-for-your-react-app-cf09eef3bb0b
class Auth {
    register = (data, leaseSettingsId, clientId) => {
        return API.register(data, leaseSettingsId, clientId).then((res)=>{
            if (res.errors) return Promise.reject({errors: res.errors});
            return Promise.resolve({token: res.token});
        }).catch((e) => {
            let errorMsg = 'There was a problem creating your account.';
            const errorType = get(e, 'errors.error._schema[0]');
            if (errorType === 'ApplicantExists') errorMsg = 'An application with these details already exists.';
            return Promise.reject({errors: {error: errorMsg}});
        });
    };

    login = (email, password, communityId) => {
        if (MOCKY) {
            return Promise.resolve({token: 'FAKETOKEN'});
        }
        return API.login(email, password, communityId).then((res) => {
            if (res.errors) return Promise.reject({errors: res.errors});
            return Promise.resolve({token: res.token});
        });
    };

    getToken = () => {
        return localStorage.getItem('access_token');
    };

    accessScope = () => {
        return localStorage.getItem('access_scope');
    };

    setSession = (authToken, scope) => {
        const nowPlus30Days = new Date(Date.now() + (30 * 24 * 60 * 60 * 1000)).getTime();
        localStorage.setItem('expires_at', nowPlus30Days);
        localStorage.setItem('access_token', authToken);
        localStorage.setItem('access_scope', scope);
    };

    logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('expires_at');
        history.push('/login');
    };

    isAuthenticated = () => {
        const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
        return new Date().getTime() < expiresAt;
    };
}

export default new Auth();
