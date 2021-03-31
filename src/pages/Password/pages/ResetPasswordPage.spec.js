import React from 'react';
import { shallow } from 'enzyme';
import { withHooks } from 'jest-react-hooks-shallow';

import API from 'api/api';
import { ROUTES } from 'constants/constants';
import ConfirmationPage from 'pages/Confirmation';
import ChangePasswordForm from 'common-components/ChangePasswordForm/ChangePasswordForm';
import { ResetPasswordPage } from './ResetPasswordPage';
import { ResetPasswordVerificationPage } from './ResetPasswordVerificationPage';

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

    it('redirects back to forgot-password when page is visited without a token in the history`s state', () => {
        const history = {
            location: { state: null },
            push: jest.fn(),
        };

        withHooks(() => {
            const wrapper = shallow(<ResetPasswordVerificationPage {...props} history={history} />);
            expect(wrapper.type()).toEqual(null);
            expect(history.push).toBeCalledWith(ROUTES.FORGOT_PASSWORD);
        });
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
