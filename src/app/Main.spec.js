import React from 'react';
import { shallow } from 'enzyme';

import { Main } from './Main';
import CriticalErrorPage from 'pages/CriticalError';

let defaultProps, configurationObject, fetchConfigurationPromise, fetchRenterProfilePromise, fetchApplicantPromise;

beforeEach(() => {
    configurationObject = {
        name: 'Cortland',
        street: '2173 Highland Ave S',
        city: 'Birmingham',
        state: 'AL',
        postal_code: 35205,
        terms_of_service: 'https://some-link.com/something.pdf',
        privacy_policy: 'https://some-link.com/something.pdf',
        logo: 'https://cdn.freebiesupply.com/logos/large/2x/cheetos-logo-png-transparent.png',
        background_image:
            'https://vignette.wikia.nocookie.net/stupididy/images/1/19/Chester_Cheetah.jpg/revision/latest?cb=20161013224811',
        primary_color: '000000',
        secondary_color: 'FFA500',
        client: {
            first_name: 'Chester',
            last_name: 'Cheetah',
            email: 'chester@cheetos.com',
            phone: '+11231231234',
        },
        unit_number: '3B',
        monthly_rent: 5000,
    };

    fetchConfigurationPromise = Promise.resolve(configurationObject);
    fetchRenterProfilePromise = Promise.resolve({});
    fetchApplicantPromise = Promise.resolve({
        application: 1,
    });

    defaultProps = {
        hasApplicant: true,
        canAccessCurrentRoute: jest.fn(),
        fetchRenterProfile: jest.fn().mockReturnValue(fetchRenterProfilePromise),
        fetchApplicant: jest.fn().mockReturnValue(fetchApplicantPromise),
        fetchConfiguration: jest.fn().mockReturnValue(fetchConfigurationPromise),
        logout: jest.fn(),
        configuration: configurationObject,
        profile: null,
        history: {
            replace: jest.fn(),
            push: jest.fn(),
        },
        location: {
            search: '',
            pathname: '',
        },
    };
    jest.useFakeTimers();
});

it('renders <CriticalErrorPage/> if hasError=true', () => {
    const wrapper = shallow(<Main {...defaultProps} theme={{}} />);
    expect(wrapper.find(CriticalErrorPage).exists()).toBe(false);
    wrapper.setState({ hasError: true });
    expect(wrapper.find(CriticalErrorPage).exists()).toBe(true);
});

describe('componentDidMount', () => {
    it('calls fetchConfiguration', function () {
        shallow(<Main {...defaultProps} />);
        expect(defaultProps.fetchConfiguration).toHaveBeenCalledTimes(1);
    });
});

describe('this.logout', () => {
    describe('isLoggedIn=true', () => {
        it('handles logging out', function () {
            localStorage.setItem('access_token', 'accesstoken');
            const wrapper = shallow(<Main {...defaultProps} isLoggedIn={true} theme={{}} />);
            wrapper.instance().logout();
            expect(localStorage.getItem('access_token')).not.toBeTruthy();
            expect(defaultProps.logout).toHaveBeenCalled();
            expect(defaultProps.history.push).toHaveBeenCalledWith({
                pathname: '/login',
                state: { errors: 'Oops, your session has timed-out. Please log back in to continue.' },
            });
        });
    });
    describe('isLoggedIn=false', () => {
        it('doesnt do anything if called', function () {
            const wrapper = shallow(<Main {...defaultProps} isLoggedIn={false} theme={{}} />);
            wrapper.instance().logout();
            expect(defaultProps.logout).not.toHaveBeenCalled();
            expect(defaultProps.history.push).not.toHaveBeenCalled();
        });
    });
});

describe('initializeApp', () => {
    it('routes to welcome page if not authenticated, but there is an associated client application', function () {
        const historyStub = jest.fn();
        const history = { push: historyStub, replace: historyStub };

        const wrapper = shallow(<Main {...defaultProps} history={history} />);

        const isAuthenticated = false;
        const configuration = { client: { applicant_id: 123 }, invitee: {} };
        wrapper.instance().initializeApp(isAuthenticated, configuration);
        expect(historyStub).toHaveBeenCalledTimes(1);
        expect(historyStub).toHaveBeenCalledWith('/welcome');
    });

    it('routes to welcome page if not authenticated, but there is an associated registered invitee', function () {
        const historyStub = jest.fn();
        const history = { push: historyStub, replace: historyStub };

        const wrapper = shallow(<Main {...defaultProps} history={history} />);

        const isAuthenticated = false;
        const configuration = { client: {}, invitee: { is_registered: true } };
        wrapper.instance().initializeApp(isAuthenticated, configuration);
        expect(historyStub).toHaveBeenCalledTimes(1);
        expect(historyStub).toHaveBeenCalledWith('/welcome');
    });

    it('routes to welcome page if not authenticated, and there is a client associated', function () {
        const historyStub = jest.fn();
        const history = { push: historyStub, replace: historyStub };

        const wrapper = shallow(<Main {...defaultProps} history={history} />);
        const isAuthenticated = false;
        const configuration = { client: {} };
        wrapper.instance().initializeApp(isAuthenticated, configuration);

        expect(historyStub).toHaveBeenCalledTimes(1);
        expect(historyStub).toHaveBeenCalledWith('/welcome');
    });

    it('routes to welcome page if not authenticated, and there is an invitee associated', function () {
        const historyStub = jest.fn();
        const history = { push: historyStub, replace: historyStub };

        const wrapper = shallow(<Main {...defaultProps} history={history} />);
        const isAuthenticated = false;
        const configuration = { invitee: {} };
        wrapper.instance().initializeApp(isAuthenticated, configuration);

        expect(historyStub).toHaveBeenCalledTimes(1);
        expect(historyStub).toHaveBeenCalledWith('/welcome');
    });

    it('routes to welcome page if not authenticated, and there is no client associated', function () {
        const historyStub = jest.fn();
        const history = { push: historyStub, replace: historyStub };

        const wrapper = shallow(<Main {...defaultProps} history={history} />);
        const isAuthenticated = false;
        const configuration = {};
        wrapper.instance().initializeApp(isAuthenticated, configuration);

        expect(historyStub).toHaveBeenCalledTimes(1);
        expect(historyStub).toHaveBeenCalledWith('/welcome');
    });

    it('does not reroute if unauthenticated and path is payment-terms', function () {
        const location = { pathname: '/payment-terms', search: '', hash: '', state: undefined };
        const historyStub = jest.fn();
        const history = { push: historyStub, replace: historyStub };

        const wrapper = shallow(<Main {...defaultProps} location={location} history={history} />);
        const isAuthenticated = false;
        const configuration = {};
        wrapper.instance().initializeApp(isAuthenticated, configuration);

        expect(historyStub).toHaveBeenCalledTimes(0);
    });

    it('does not reroute if path is privacy-policy', function () {
        const location = { pathname: '/privacy-policy', search: '', hash: '', state: undefined };
        const historyStub = jest.fn();
        const history = { push: historyStub, replace: historyStub };

        const wrapper = shallow(<Main {...defaultProps} location={location} history={history} />);
        const isAuthenticated = false;
        const configuration = {};
        wrapper.instance().initializeApp(isAuthenticated, configuration);

        expect(historyStub).toHaveBeenCalledTimes(0);
    });

    it('routes to unit unavailable page if not authenticated, and unit is not available', function () {
        const historyStub = jest.fn();
        const history = { push: historyStub, replace: historyStub };

        const wrapper = shallow(<Main {...defaultProps} history={history} />);
        const isAuthenticated = false;
        const configuration = {
            unit: {
                is_unavailable: true,
            },
        };
        wrapper.instance().initializeApp(isAuthenticated, configuration);

        expect(historyStub).toHaveBeenCalledTimes(1);
        expect(historyStub).toHaveBeenCalledWith('/unauth-unit-unavailable');
    });

    it('calls fetchRenterProfile if authenticated', async function () {
        const applicant = { application: 1 };
        const wrapper = shallow(<Main {...defaultProps} applicant={applicant} />);
        const isAuthenticated = true;
        const configuration = {};
        await wrapper.instance().initializeApp(isAuthenticated, configuration);
        expect(defaultProps.fetchRenterProfile).toHaveBeenCalledWith(1);
    });
});
