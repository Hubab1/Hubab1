import history from '../history';

class Auth {
  login = (username, password) => {
        return Promise.resolve({token: 'abcdefgh'});
  }

  setSession = (authToken) => {
        const nowPlus30Days = new Date(Date.now() + (30 * 24 * 60 * 60 * 1000)).getTime();
        localStorage.setItem('expires_at', nowPlus30Days);
        localStorage.setItem('access_token', authToken);
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