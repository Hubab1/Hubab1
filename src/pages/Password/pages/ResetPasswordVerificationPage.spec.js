import React from 'react';
import { shallow } from 'enzyme';
import { withHooks } from 'jest-react-hooks-shallow';
import { Formik } from 'formik';

import API from 'api/api';
import { ROUTES } from 'constants/constants';
import Page from 'common-components/Page/Page';
import {
    validationSchema,
    INVALID_CODE_ERROR_MESSAGE,
    RESENT_ERROR_MESSAGE,
    ResetPasswordVerificationPage,
} from './ResetPasswordVerificationPage';

const mockPasswordResetVerification = (returnValue = {}) => {
    return jest.spyOn(API, 'passwordResetVerification').mockReturnValue(returnValue);
};

const mockPasswordResetRequest = (returnValue = {}) => {
    return jest.spyOn(API, 'passwordResetRequest').mockReturnValue(returnValue);
};

describe('ResetPasswordVerificationPage - validation', () => {
    it('valid code', () => {
        expect(validationSchema.isValidSync({ resetCode: '123456' })).toBe(true);
    });

    it('invalid code - too long', () => {
        expect(validationSchema.isValidSync({ resetCode: '1234567' })).toBe(false);
    });

    it('invalid code - only numbers', () => {
        expect(validationSchema.isValidSync({ resetCode: '12345A' })).toBe(false);
    });
});

describe('ResetPasswordVerificationPage', () => {
    let props = {};

    beforeEach(() => {
        props = {
            communityId: '1',
            history: {
                location: {
                    state: {},
                },
                push: jest.fn(),
            },
            toggleLoader: jest.fn(),
        };
    });

    it('redirects back to forgot-password when page is visited without any recipient data in the history`s state', () => {
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

    it('handles successful attempt to verify reset password using a phone number', async () => {
        const token = '12345';
        const request = mockPasswordResetVerification(Promise.resolve({ token }));

        const history = {
            location: { state: { phoneNumber: '(312) 434-3423' } },
            push: jest.fn(),
        };
        const mockFormValues = { resetCode: '123456' };
        const wrapper = shallow(<ResetPasswordVerificationPage {...props} history={history} />);
        const onSubmitHandler = wrapper.find(Formik).prop('onSubmit');

        await onSubmitHandler(mockFormValues, { setSubmitting: jest.fn(), setErrors: jest.fn() });

        expect(props.toggleLoader).toBeCalledWith(true);
        expect(request).toBeCalledWith({
            phone_number: history.location.state.phoneNumber,
            code: mockFormValues.resetCode,
            lease_settings_id: props.communityId,
        });
        expect(history.push).toBeCalledWith({
            pathname: ROUTES.RESET_PASSWORD,
            state: {
                token,
                channel: 'sms',
            },
        });
        expect(props.toggleLoader).toBeCalledWith(false);
    });

    it('handles successful attempt to verify reset password using an email', async () => {
        const token = '12345';
        const request = mockPasswordResetVerification(Promise.resolve({ token }));

        const history = {
            location: { state: { email: 'johndo@mail.com' } },
            push: jest.fn(),
        };
        const mockFormValues = { resetCode: '123456' };
        const wrapper = shallow(<ResetPasswordVerificationPage {...props} history={history} />);
        const onSubmitHandler = wrapper.find(Formik).prop('onSubmit');

        await onSubmitHandler(mockFormValues, { setSubmitting: jest.fn(), setErrors: jest.fn() });

        expect(props.toggleLoader).toBeCalledWith(true);
        expect(request).toBeCalledWith({
            email: history.location.state.email,
            code: mockFormValues.resetCode,
            lease_settings_id: props.communityId,
        });
        expect(history.push).toBeCalledWith({
            pathname: ROUTES.RESET_PASSWORD,
            state: {
                token,
                channel: 'email',
            },
        });
        expect(props.toggleLoader).toBeCalledWith(false);
    });

    it('handles failed attempt to verify reset password', async () => {
        mockPasswordResetVerification(Promise.reject());

        const history = {
            location: { state: { email: 'johndo@mail.com' } },
            push: jest.fn(),
        };
        const setSubmitting = jest.fn();
        const setErrors = jest.fn();
        const mockFormValues = { resetCode: '123456' };
        const wrapper = shallow(<ResetPasswordVerificationPage {...props} history={history} />);
        const onSubmitHandler = wrapper.find(Formik).prop('onSubmit');

        await onSubmitHandler(mockFormValues, { setSubmitting, setErrors });

        expect(props.toggleLoader).toBeCalledWith(true);
        expect(setErrors).toBeCalledWith({ resetCode: INVALID_CODE_ERROR_MESSAGE });
        expect(props.toggleLoader).toBeCalledWith(false);
    });

    it('handles successful attempt to resend code', async () => {
        const request = mockPasswordResetRequest(Promise.resolve({}));

        const history = {
            location: { state: { email: 'johndo@mail.com' } },
            push: jest.fn(),
        };
        const wrapper = shallow(<ResetPasswordVerificationPage {...props} history={history} />);
        const onLinkClickHandler = wrapper.find('[data-testid="resent-code-link"]').prop('onClick');

        await onLinkClickHandler();

        expect(props.toggleLoader).toBeCalledWith(true);
        expect(request).toBeCalledWith({
            email: history.location.state.email,
            lease_settings_id: props.communityId,
            channel: 'email',
        });
        expect(props.toggleLoader).toBeCalledWith(false);
    });

    it('handles failed attempt to resend code', async () => {
        mockPasswordResetRequest(Promise.reject());

        const history = {
            location: { state: { email: 'johndo@mail.com' } },
            push: jest.fn(),
        };
        const wrapper = shallow(<ResetPasswordVerificationPage {...props} history={history} />);
        const onLinkClickHandler = wrapper.find('[data-testid="resent-code-link"]').prop('onClick');

        await onLinkClickHandler();

        expect(props.toggleLoader).toBeCalledWith(true);
        expect(wrapper.find(Page).prop('notification')).toEqual({
            type: 'error',
            messages: [RESENT_ERROR_MESSAGE],
        });
        expect(props.toggleLoader).toBeCalledWith(false);
    });
});
