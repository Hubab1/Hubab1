import React from 'react';
import { shallow } from 'enzyme';

import { Main } from 'Main';

let defaultProps, leaseSettingsObject, fetchLeaseSettingsPromise, fetchRenterProfilePromise;

beforeEach(() => {

    leaseSettingsObject = {
        "name": "Cortland",
        "street": "2173 Highland Ave S",
        "city": "Birmingham",
        "state": "AL",
        "postal_code": 35205,
        "terms_of_service": "https://some-link.com/something.pdf",
        "privacy_policy": "https://some-link.com/something.pdf",
        "logo": "https://cdn.freebiesupply.com/logos/large/2x/cheetos-logo-png-transparent.png",
        "background_image": "https://vignette.wikia.nocookie.net/stupididy/images/1/19/Chester_Cheetah.jpg/revision/latest?cb=20161013224811",
        "primary_color": "#000000",
        "secondary_color": "#FFA500",
        "client": {
            "first_name": "Chester",
            "last_name": "Cheetah",
            "email": "chester@cheetos.com",
            "phone": "+11231231234",
        },
        "unit_number": "3B",
        "monthly_rent": 5000,
    };

    fetchLeaseSettingsPromise = Promise.resolve(leaseSettingsObject);
    fetchRenterProfilePromise = Promise.resolve({});

    defaultProps = {
        fetchRenterProfile: jest.fn().mockReturnValue(fetchRenterProfilePromise),
        fetchLeaseSettings: jest.fn().mockReturnValue(fetchLeaseSettingsPromise),
        leaseSettings: leaseSettingsObject,
        profile: null,
        history: {
            replace: jest.fn()
        },
        location: {
            search: '',
            pathname: ''
        }
    }
})



describe('componentDidMount', () => {
    it('calls fetchLeaseSettings', function () {
        const wrapper = shallow(<Main { ...defaultProps} />);

        expect(defaultProps.fetchLeaseSettings).toHaveBeenCalledTimes(1);

    });
})

describe('mountNavigation', () => {
    it('calls fetchRenterProfile if authenticated', function () {
        const wrapper = shallow(<Main { ...defaultProps} />);

        const isAuthenticated = true;
        const leaseSettings = {};
        wrapper.instance().mountNavigation(isAuthenticated, leaseSettings);
        expect(defaultProps.fetchRenterProfile).toHaveBeenCalledTimes(1);
    });
    it('routes to login page if not authenticated, but there is an associated application', function () {
        const historyStub = jest.fn();
        const history = {push: historyStub, replace: historyStub}

        const wrapper = shallow(<Main { ...defaultProps} history={history} />);

        const isAuthenticated = false;
        const leaseSettings = {client:{application_id:123}};
        wrapper.instance().mountNavigation(isAuthenticated, leaseSettings);
        expect(historyStub).toHaveBeenCalledTimes(1);
        expect(historyStub).toHaveBeenCalledWith('/login');
    });
    it('routes to welcome page if not authenticated, and there is a client associated', function () {
        const historyStub = jest.fn();
        const history = {push: historyStub, replace: historyStub}

        const wrapper = shallow(<Main { ...defaultProps} history={history} />);
        const isAuthenticated = false;
        const leaseSettings = {client:{}};
        wrapper.instance().mountNavigation(isAuthenticated, leaseSettings);

        expect(historyStub).toHaveBeenCalledTimes(1);
        expect(historyStub).toHaveBeenCalledWith('/welcome');
    });

    it('routes to welcome page if not authenticated, and there is no client associated', function () {
        const historyStub = jest.fn();
        const history = {push: historyStub, replace: historyStub}

        const wrapper = shallow(<Main { ...defaultProps} history={history} />);
        const isAuthenticated = false;
        const leaseSettings = {};
        wrapper.instance().mountNavigation(isAuthenticated, leaseSettings);

        expect(historyStub).toHaveBeenCalledTimes(1);
        expect(historyStub).toHaveBeenCalledWith('/welcome');
    });


})
