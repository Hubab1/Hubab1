import React from 'react';
import { shallow } from 'enzyme';

import {
    GENERIC_ERROR_MESSAGE,
    CARD_DECLINE_ERROR_MESSAGE,
    PaymentForm,
    AVAILABILITY_ERROR_MESSAGE,
    UNAVAILABLE_ERROR_MESSAGE,
} from './PaymentForm';
import API from 'app/api';

let defaultProps;
beforeEach(() => {
    defaultProps = {
        applicationFee: 60.567,
        contactPhone: 'community@company.com',
        unit: { unit_number: '123' },
        stripe: { createToken: jest.fn().mockResolvedValue({ token: { id: 123 } }) },
        fetchApplicant: jest.fn(),
        fetchRenterProfile: jest.fn(),
        onSuccess: jest.fn(),
        setDisableBack: jest.fn(),
        toggleLoader: jest.fn(),
    };
});

it('Shows a messsage about stripe processing', function () {
    const wrapper = shallow(<PaymentForm {...defaultProps} />);
    expect(wrapper.text()).toContain('Stripe and its affiliates will be processing this transaction');
});

it('handleSubmit sets paymentSuccess to true on Success', function () {
    const wrapper = shallow(<PaymentForm {...defaultProps} />);

    API.stripePayment = jest.fn().mockResolvedValue({ success: 'payment succeeded!' });

    return wrapper
        .instance()
        .handleSubmit({ preventDefault: () => {} })
        .then(() => {
            expect(API.stripePayment).toHaveBeenCalledWith({ token: 123 });
            expect(defaultProps.onSuccess).toHaveBeenCalled();
            expect(wrapper.state().submitting).toBeFalsy();
        });
});

it('handleSubmit sets error on API fail', function () {
    const wrapper = shallow(<PaymentForm {...defaultProps} />);

    API.stripePayment = jest.fn().mockResolvedValue({ errors: { error: { message: 'dooty doot doot' } } });

    return wrapper
        .instance()
        .handleSubmit({ preventDefault: () => {} })
        .then(() => {
            expect(API.stripePayment).toHaveBeenCalledWith({ token: 123 });
            expect(wrapper.state().errors).toEqual([GENERIC_ERROR_MESSAGE]);
            expect(wrapper.state().submitting).toBeFalsy();
        });
});

it('handleSubmit sets error on Unit PMS Unavailable error', () => {
    const wrapper = shallow(<PaymentForm {...defaultProps} />);

    API.stripePayment = jest.fn().mockResolvedValue({
        error_type: 'UnitPmsUnavailableError',
        errors: 'Unit is no longer available.',
    });

    return wrapper
        .instance()
        .handleSubmit({ preventDefault: () => {} })
        .then(() => {
            expect(API.stripePayment).toHaveBeenCalledWith({ token: 123 });
            expect(wrapper.state().errors).toEqual([
                AVAILABILITY_ERROR_MESSAGE(defaultProps.unit, 'community@company.com'),
            ]);
            expect(wrapper.state().submitting).toBeFalsy();
        });
});

it('handleSubmit sets error on Unit Temporarily Unavailable error', () => {
    const wrapper = shallow(<PaymentForm {...defaultProps} />);

    API.stripePayment = jest.fn().mockResolvedValue({
        error_type: 'UnitTemporarilyUnavailableError',
        errors: 'Unit is temporarily unavailable',
    });

    return wrapper
        .instance()
        .handleSubmit({ preventDefault: () => {} })
        .then(() => {
            expect(API.stripePayment).toHaveBeenCalledWith({ token: 123 });
            expect(wrapper.state().errors).toEqual([
                AVAILABILITY_ERROR_MESSAGE(defaultProps.unit, 'community@company.com'),
            ]);
            expect(wrapper.state().submitting).toBeFalsy();
        });
});

it('handleSubmit sets error on Unit Unavailable error', () => {
    const wrapper = shallow(<PaymentForm {...defaultProps} />);

    API.stripePayment = jest.fn().mockResolvedValue({
        error_type: 'UnitUnavailableError',
        errors: 'Unit is no longer available.',
    });

    return wrapper
        .instance()
        .handleSubmit({ preventDefault: () => {} })
        .then(() => {
            expect(API.stripePayment).toHaveBeenCalledWith({ token: 123 });
            expect(wrapper.state().errors).toEqual([
                UNAVAILABLE_ERROR_MESSAGE(defaultProps.unit, 'community@company.com'),
            ]);
            expect(wrapper.state().submitting).toBeFalsy();
        });
});

it('handleSubmit sets error on Unit Temporarily Unavailable error and no unit selected', () => {
    const wrapper = shallow(<PaymentForm {...defaultProps} unit={null} />);

    API.stripePayment = jest.fn().mockResolvedValue({
        error_type: 'UnitTemporarilyUnavailableError',
        errors: 'Unit is temporarily unavailable',
    });

    return wrapper
        .instance()
        .handleSubmit({ preventDefault: () => {} })
        .then(() => {
            expect(API.stripePayment).toHaveBeenCalledWith({ token: 123 });
            expect(wrapper.state().errors).toEqual([AVAILABILITY_ERROR_MESSAGE(null, 'community@company.com')]);
            expect(wrapper.state().submitting).toBeFalsy();
        });
});

it('handleSubmit sets error on API fail because of card', function () {
    const wrapper = shallow(<PaymentForm {...defaultProps} />);

    API.stripePayment = jest.fn().mockResolvedValue({ errors: { error: { type: 'card_error' } } });

    return wrapper
        .instance()
        .handleSubmit({ preventDefault: () => {} })
        .then(() => {
            expect(API.stripePayment).toHaveBeenCalledWith({ token: 123 });
            expect(wrapper.state().errors).toEqual([CARD_DECLINE_ERROR_MESSAGE]);
            expect(wrapper.state().submitting).toBeFalsy();
        });
});

it('handles server error', function () {
    const wrapper = shallow(<PaymentForm {...defaultProps} />);

    API.stripePayment = jest.fn().mockRejectedValue({});

    return wrapper
        .instance()
        .handleSubmit({ preventDefault: () => {} })
        .then(() => {
            expect(wrapper.state().errors).toContain(GENERIC_ERROR_MESSAGE);
        });
});

it('handleSubmit sets error on stripe fail', function () {
    defaultProps.stripe.createToken = jest.fn().mockRejectedValue('boo');
    const genericErrorMessage = GENERIC_ERROR_MESSAGE;

    const wrapper = shallow(<PaymentForm {...defaultProps} />);

    return wrapper
        .instance()
        .handleSubmit({ preventDefault: () => {} })
        .then(() => {
            expect(wrapper.state().errors).toEqual([genericErrorMessage]);
            expect(wrapper.state().submitting).toBeFalsy();
        });
});
