import React from 'react';
import { shallow } from 'enzyme';

import { ROUTES } from 'constants/constants';
import { LoginPage } from './LoginPage';

jest.mock('utils/auth', () => {
    class Auth {
        setSession = () => {
            return true;
        };
        login = () => {
            return Promise.resolve({ token: 'abc' });
        };
        isAuthenticated() {
            return true;
        }
    }
    return new Auth();
});

jest.mock('utils/history', () => {
    class History {
        push() {
            return true;
        }
    }
    return History;
});

let defaultProps;
beforeEach(() => {
    defaultProps = {
        communityId: '123',
        configuration: {},
        location: {
            state: {},
        },
        history: {
            replace: jest.fn(),
        },
        community: {
            contact_phone: '4444444444',
        },
        toggleLoader: jest.fn(),
        fetchRenterProfile: jest.fn().mockReturnValue(Promise.resolve()),
        fetchApplicant: jest.fn().mockReturnValue(Promise.resolve({})),
    };
});

it('sets session after logging in', function () {
    const setSession = jest.fn();
    const wrapper = shallow(<LoginPage {...defaultProps} />);
    wrapper.instance().auth.setSession = setSession;
    return wrapper
        .instance()
        .onSubmit({ username: 'Frank', password: 'Abagail' }, { setSubmitting: function () {} })
        .then(() => {
            expect(setSession).toHaveBeenCalledWith('abc', '123');
        });
});

it('redirects to applications page when applicant has multiple active apps after login', function () {
    const mockFetchApplicant = jest.fn().mockReturnValue(Promise.resolve({ num_active_apps: 2 }));
    const setSession = jest.fn();
    const wrapper = shallow(<LoginPage {...defaultProps} fetchApplicant={mockFetchApplicant} />);
    wrapper.instance().auth.setSession = setSession;
    return wrapper
        .instance()
        .onSubmit({ username: 'Frank', password: 'Abagail' }, { setSubmitting: function () {} })
        .then(() => {
            expect(defaultProps.history.replace).toBeCalledWith(ROUTES.APPLICATIONS);
        });
});
it('uses application id from config to fetch renter profile when is present after login', function () {
    const configuration = {
        application_id: 1,
    };
    const setSession = jest.fn();
    const wrapper = shallow(<LoginPage {...defaultProps} configuration={configuration} />);
    wrapper.instance().auth.setSession = setSession;
    return wrapper
        .instance()
        .onSubmit({ username: 'Frank', password: 'Abagail' }, { setSubmitting: function () {} })
        .then(() => {
            expect(defaultProps.fetchRenterProfile).toBeCalledWith(configuration.application_id);
        });
});

it('renders invalid credentials error', function () {
    const wrapper = shallow(<LoginPage {...defaultProps} />);
    wrapper.instance().auth.login = () => Promise.reject({ errors: { error: 'Invalid credentials' } });
    return wrapper
        .instance()
        .onSubmit({}, { setSubmitting: () => {} })
        .then(() => {
            expect(wrapper.state('errors')).toEqual([
                'The email and password you entered do not match our records. Please try again.',
            ]);
        });
});

it('renders no application error', function () {
    const wrapper = shallow(<LoginPage {...defaultProps} />);
    wrapper.instance().auth.login = () => Promise.reject({ errors: { error: 'Application does not exist' } });
    return wrapper
        .instance()
        .onSubmit({}, { setSubmitting: () => {} })
        .then(() => {
            expect(wrapper.state('errors')).toEqual([
                `Oops, there is no longer an application associated with this account. Please call us at 444‑444‑4444 if you have any questions.`,
            ]);
        });
});

it('renders genereic error', function () {
    const wrapper = shallow(<LoginPage {...defaultProps} />);
    wrapper.instance().auth.login = () => Promise.reject({ errors: { error: 'something' } });
    return wrapper
        .instance()
        .onSubmit({}, { setSubmitting: () => {} })
        .then(() => {
            expect(wrapper.state('errors')).toEqual(['Oops, something has gone wrong.']);
        });
});

it('renders errors from location state', () => {
    const wrapper = shallow(
        <LoginPage {...defaultProps} location={{ state: { errors: 'You have been logged out' } }} />
    );
    expect(wrapper.getElement()).toMatchSnapshot();
});
