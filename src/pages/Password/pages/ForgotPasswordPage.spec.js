import React from 'react';
import { shallow } from 'enzyme';
import { Formik } from 'formik';

import API from 'api/api';
import { ROUTES } from 'constants/constants';
import { validationSchema, ERROR_MESSAGE, ForgotPasswordPage } from './ForgotPasswordPage';
import Page from 'common-components/Page/Page';

const mockPasswordResetRequest = (returnValue = {}) => {
    return jest.spyOn(API, 'passwordResetRequest').mockReturnValue(returnValue);
};

describe('ForgotPasswordPage - validation', () => {
    it('valid phone number', () => {
        expect(validationSchema.isValidSync({ phone: '(312) 434-3423' })).toBe(true);
    });

    it('valid email', () => {
        expect(validationSchema.isValidSync({ email: 'johndo@mail.com' })).toBe(true);
    });

    it('invalid phone number', () => {
        expect(validationSchema.isValidSync({ phone: '3423' })).toBe(false);
    });

    it('invalid email', () => {
        expect(validationSchema.isValidSync({ email: 'johndo' })).toBe(false);
    });
});

describe('ForgotPasswordPage', () => {
    let props = {};

    beforeEach(() => {
        props = {
            communityId: '1',
            history: {
                push: jest.fn(),
            },
            toggleLoader: jest.fn(),
        };
    });

    it('renders phone number input field on default instead of email field', () => {
        const wrapper = shallow(<ForgotPasswordPage {...props} />);
        expect(wrapper.find(Formik).dive().find('[data-testid="phone-number-input"]').length).toBe(1);
        expect(wrapper.find(Formik).dive().find('[data-testid="email-input"]').length).toBe(0);
    });

    it('renders email input field instead of phone number field once channel link is clicked', () => {
        const wrapper = shallow(<ForgotPasswordPage {...props} />);
        const link = wrapper.find(Formik).dive().find('[data-testid="channel-link"]');
        link.simulate('click', {});

        expect(wrapper.find(Formik).dive().find('[data-testid="email-input"]').length).toBe(1);
        expect(wrapper.find(Formik).dive().find('[data-testid="phone-number-input"]').length).toBe(0);
    });

    it('handles successful attempt to request reset password', async () => {
        mockPasswordResetRequest(Promise.resolve({}));

        const mockFormValues = { phone: '(312) 434-3423', email: 'johnd0@mail.com' };
        const wrapper = shallow(<ForgotPasswordPage {...props} />);
        const onSubmitHandler = wrapper.find(Formik).prop('onSubmit');

        await onSubmitHandler(mockFormValues, { setSubmitting: jest.fn() });

        expect(props.toggleLoader).toBeCalledWith(true);
        expect(props.history.push).toBeCalledWith({
            pathname: ROUTES.VERIFY_PASSWORD_CODE,
            state: {
                phoneNumber: mockFormValues.phone,
                email: mockFormValues.email,
            },
        });
        expect(props.toggleLoader).toBeCalledWith(false);
    });

    it('handles failed attempt to request reset password', async () => {
        mockPasswordResetRequest(Promise.reject());

        const mockFormValues = { phone: '(312) 434-3423', email: 'johnd0@mail.com' };
        const wrapper = shallow(<ForgotPasswordPage {...props} />);
        const onSubmitHandler = wrapper.find(Formik).prop('onSubmit');

        await onSubmitHandler(mockFormValues, { setSubmitting: jest.fn() });

        expect(props.toggleLoader).toBeCalledWith(true);
        expect(wrapper.find(Page).prop('notification')).toEqual({
            type: 'error',
            messages: [ERROR_MESSAGE],
        });
        expect(props.toggleLoader).toBeCalledWith(false);
    });
});
