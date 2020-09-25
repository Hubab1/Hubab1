import React from 'react';
import { shallow } from 'enzyme';

import ResetPassword from './ResetPassword';
import API from 'app/api';

let defaultProps;
beforeEach(() => {
    defaultProps = {
        communityId: '1',
        history: {location: {pathname: '/password/verify', search: '', hash: '', state: {token: 'secret token'}}},
        profile: null
    };
});

it('calls API.passwordReset onSubmit', function() {
    const token = defaultProps.history.location.state.token;

    const wrapper = shallow( <ResetPassword {...defaultProps}/> );
    API.passwordReset = jest.fn().mockReturnValue(Promise.resolve());
    return wrapper.instance().onSubmit({password: 'Abagail'}, { setSubmitting: function() {} }).then(() => {
        expect(API.passwordReset).toHaveBeenCalledWith('Abagail', token);
    });
});

it('renders errors if has errors', function() {
    const token = defaultProps.history.location.state.token;

    const wrapper = shallow( <ResetPassword {...defaultProps}/> );
    API.passwordReset = jest.fn().mockReturnValue(
        Promise.resolve(
            {errors: ['Invalid credentials']}
        )
    );
    return wrapper.instance().onSubmit({ password: 'Abagail' }, { setSubmitting: function() {} }).then(() => {
        expect(wrapper.state('errors')).toEqual(['Invalid credentials']);
    });

});
