import React from 'react';
import { shallow } from 'enzyme';

import { LoginPage } from 'components/login/LoginPage';

jest.mock('utils/auth', () => {
    class Auth {
        setSession = (token) => {
            return true;
        }
        login = (u, p) => {
            return Promise.resolve({ token: 'abc' });
        }
        isAuthenticated() {
            return true;
        }
    }
    return new Auth();
});

jest.mock('app/history', () => {
    class History {
        push(val) {
            return true;
        }
    }
    return History;
});

let defaultProps;
beforeEach(() => {
    defaultProps = {
        communityId: "123",
        location: {
            state: {

            }
        }
    }
});


it('sets session after logging in', function() {
    const setSession = jest.fn();
    const wrapper = shallow( < LoginPage {...defaultProps}/> );
    wrapper.instance().auth.setSession = setSession;
    return wrapper.instance().onSubmit({ username: 'Frank', password: 'Abagail' }, { setSubmitting: function() {} }).then(() => {
        expect(setSession).toHaveBeenCalledWith('abc', '123');
    });
});

it('renders errors if has errors', function() {
    const wrapper = shallow( < LoginPage {...defaultProps}/> );
    wrapper.instance().auth.login = () => Promise.reject({errors: {error: 'Invalid credentials'}});
    return wrapper.instance().onSubmit({}, {setSubmitting: ()=>{}}).then(() => {
        expect(wrapper.state('errors')).toEqual(['The email and password you entered do not match our records. Please try again.']);
    });
});

it('renders errors from location state', () => {
    const wrapper = shallow( < LoginPage {...defaultProps} location={{state: {errors: "You have been logged out"}}}/> );
    expect(wrapper.getElement()).toMatchSnapshot();
});
