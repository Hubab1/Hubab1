import React from 'react';
import { shallow } from 'enzyme';

import { LoginPage } from 'components/login/LoginPage';

jest.mock('utils/auth', ()=>{
    class Auth {
        setSession = (token) => {
            return true;
        }
        login = (u, p) => {
            return Promise.resolve({token: 'abc'});
        }
        isAuthenticated () {
            return true;
        }
    }
    return new Auth();
});

jest.mock('../../history', ()=>{
    class History {
        push (val) {
            return true;
        }
    }
    return History;
});


it('sets session after logging in', function () {
    const setSession = jest.fn();
    const wrapper = shallow(<LoginPage communityId="123"/>);
    wrapper.instance().auth.setSession = setSession;
    return wrapper.instance().onSubmit({username: 'Frank', password: 'Abagail'}, {setSubmitting: function(){}}).then(() => {
        expect(setSession).toHaveBeenCalledWith('abc', '123');
    });
});