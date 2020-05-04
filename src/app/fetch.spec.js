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
    delete global.window.location;
        global.window = Object.create(window);
        global.window.location = {
        port: '123',
        protocol: 'http:',
        hostname: 'localhost',
        href: 'dummy',
        origin: 'https://apply.funnelleasing.com'
    };
    beforeEach(() => {
        global.fetch = jest.fn().mockReturnValue({
            headers: { get: jest.fn().mockReturnValue('TokenExpiredError') }
        });
    })
    it('clears localStorage and redirects to the login page', () => {
        localStorage.setItem('access_token', 'fakeaccesstoken');
        expect(localStorage.getItem('access_token')).toBe('fakeaccesstoken');
        myFetch().catch(() => {
            expect(localStorage.getItem('access_token')).toBe(null);
            expect(global.location.href).toBe('https://apply.funnelleasing.com/2/login');
        });
    })
})
