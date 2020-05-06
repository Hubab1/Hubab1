import myFetch from './fetch';

jest.mock('reducers/store', () => ({
    __esModule: true,
    default: {
        dispatch: ()=>{},
        getState: () => ({
            siteConfig: {
                basename: 2
            }
        })
    },
    actions: {logout: jest.fn()},
  }));

describe('token expired', () => {
    beforeEach(() => {
        delete global.window.location;
        global.window = Object.create(window);
        global.window.location = {
            port: '123',
            protocol: 'https:',
            hostname: 'localhost',
            href: 'dummy',
            origin: 'https://apply.funnelleasing.com'
        };
        global.fetch = jest.fn().mockReturnValue({
            headers: { get: jest.fn().mockReturnValue('TokenExpiredError') }
        });
    });
    it('clears localStorage and redirects to the login page', () => {
        localStorage.setItem('access_token', 'fakeaccesstoken');
        expect(localStorage.getItem('access_token')).toBe('fakeaccesstoken');
        myFetch().catch(() => {
            expect(localStorage.getItem('access_token')).toBe(null);
            expect(global.location.href).toBe('https://apply.funnelleasing.com/2/login');
        });
    });
    it('doesnt change href if already on login page', () => {
        localStorage.setItem('access_token', 'fakeaccesstoken');
        expect(localStorage.getItem('access_token')).toBe('fakeaccesstoken');
        global.location.href = 'https://apply.funnelleasing.com/2/login/';
        myFetch().catch(() => {
            expect(localStorage.getItem('access_token')).toBe(null);
            // trailing '/' shows that it doesn't try changing url
            expect(global.location.href).toBe('https://apply.funnelleasing.com/2/login/');
        });
    });
});

describe('token not expired', () => {
    beforeEach(() => {
        delete global.window.location;
        global.window = Object.create(window);
        global.window.location = {
            port: '123',
            protocol: 'https:',
            hostname: 'localhost',
            href: 'dummy',
            origin: 'https://apply.funnelleasing.com'
        };
        global.fetch = jest.fn().mockReturnValue({
            headers: { get: jest.fn().mockReturnValue('') }
        });
    });
    it('doesnt clear access token and doesnt change url', () => {
        localStorage.setItem('access_token', 'fakeaccesstoken');
        expect(localStorage.getItem('access_token')).toBe('fakeaccesstoken');
        myFetch().then(() => {
            expect(localStorage.getItem('access_token')).toBe('fakeaccesstoken');
            expect(global.location.href).not.toBe('https://apply.funnelleasing.com/2/login');
        });
    });
});
