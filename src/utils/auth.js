import history from 'app/history';

// token auth service loosely based on the authentication service exemplified here: https://medium.appbase.io/how-to-implement-authentication-for-your-react-app-cf09eef3bb0b
class Auth {
    register = (data) => {
        return Promise.resolve({token: 'abcdefgh'});
    }
    login = (username, password) => {
        return Promise.resolve({token: 'abcdefgh'});
    }

    getToken = () => {
        return localStorage.getItem('access_token');
    }

    accessScope = () => {
        return localStorage.getItem('access_scope');
    }

    setSession = (authToken, scope) => {
        const nowPlus30Days = new Date(Date.now() + (30 * 24 * 60 * 60 * 1000)).getTime();
        localStorage.setItem('expires_at', nowPlus30Days);
        localStorage.setItem('access_token', authToken);
        localStorage.setItem('access_scope', scope);
    }

    logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('expires_at');
        history.push('/login');
    }

    isAuthenticated = () => {
        let expiresAt = JSON.parse(localStorage.getItem('expires_at'));
        return new Date().getTime() < expiresAt;
    }
}

export default new Auth();
