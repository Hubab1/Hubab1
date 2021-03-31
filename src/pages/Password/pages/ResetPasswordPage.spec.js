import React from 'react';
import { shallow } from 'enzyme';

import ConfirmationPage from 'pages/Confirmation';
import ChangePasswordForm from 'common-components/ChangePasswordForm/ChangePasswordForm';
import { ResetPasswordPage } from './ResetPasswordPage';
import API from 'api/api';

const mockPasswordReset = (returnValue = {}) => {
    return jest.spyOn(API, 'passwordReset').mockReturnValue(returnValue);
};

describe('ResetPasswordPage', () => {
    let props;
    beforeEach(() => {
        props = {
            communityId: '1',
            history: {
                location: { pathname: '/password/verify', search: '', hash: '', state: { token: 'secret token' } },
            },
            profile: null,
            toggleLoader: jest.fn(),
        };
    });

    it('handles successful attempt to reset password', async () => {
        const request = mockPasswordReset(Promise.resolve({}));
        const token = props.history.location.state.token;
        const wrapper = shallow(<ResetPasswordPage {...props} />);
        const onSubmitHandler = wrapper.find(ChangePasswordForm).prop('onSubmit');

        await onSubmitHandler({ password: 'Abagail' }, { setSubmitting: jest.fn() });

        expect(props.toggleLoader).toBeCalledWith(true);
        expect(request).toHaveBeenCalledWith('Abagail', token, true);
        expect(props.toggleLoader).toBeCalledWith(false);
        expect(wrapper.find(ConfirmationPage).length).toBe(1);
        expect(wrapper.find(ChangePasswordForm).length).toBe(0);
    });

    it('handles failed attempt to reset password', async () => {
        const submitErrorMessage = 'Invalid credentials';
        mockPasswordReset(Promise.resolve({ errors: [submitErrorMessage] }));
        const wrapper = shallow(<ResetPasswordPage {...props} />);
        const onSubmitHandler = wrapper.find(ChangePasswordForm).prop('onSubmit');

        await onSubmitHandler({ password: 'Abagail' }, { setSubmitting: jest.fn() });

        expect(props.toggleLoader).toBeCalledWith(true);
        expect(wrapper.find(ChangePasswordForm).prop('errors')).toEqual([submitErrorMessage]);
        expect(props.toggleLoader).toBeCalledWith(false);
        expect(wrapper.find(ConfirmationPage).length).toBe(0);
    });
});
