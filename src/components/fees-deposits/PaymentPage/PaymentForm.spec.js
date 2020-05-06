import React from 'react';
import { shallow } from 'enzyme';

import { PaymentForm } from './PaymentForm';
import API from 'app/api';


let defaultProps;
beforeEach(() => {
    defaultProps = {
        applicationFee: 60.567,
        stripe: {createToken: jest.fn().mockResolvedValue({token:{id:123}})},
        fetchApplicant: jest.fn(),
        fetchRenterProfile: jest.fn(),
        onSuccess: jest.fn(),
    }
})

it('Shows a messsage about stripe processing', function() {
    const wrapper = shallow( <PaymentForm {...defaultProps}/> );
    expect(wrapper.text()).toContain('Stripe and its affiliates will be processing this transaction');
});
it('handleSubmit sets paymentSuccess to true on Success', function() {
    const wrapper = shallow( <PaymentForm {...defaultProps}/> );

    API.stripePayment = jest.fn().mockResolvedValue({success: 'payment succeeded!'})

    return wrapper.instance().handleSubmit({preventDefault: () => {} }).then(() => {
        expect(API.stripePayment).toHaveBeenCalledWith({token: 123});
        expect(defaultProps.onSuccess).toHaveBeenCalled();
        expect(wrapper.state().submitting).toBeFalsy();
    });
});

it('handleSubmit sets error on API fail', function() {
    const wrapper = shallow( <PaymentForm {...defaultProps}/> );

    API.stripePayment = jest.fn().mockResolvedValue({errors: {error: {message: 'dooty doot doot'}}})

    return wrapper.instance().handleSubmit({preventDefault: () => {} }).then(() => {
        expect(API.stripePayment).toHaveBeenCalledWith({token: 123});
        expect(wrapper.state().errors).toEqual(['dooty doot doot']);
        expect(wrapper.state().submitting).toBeFalsy();
    });
});

it('handleSubmit sets error on stripe fail', function() {
    defaultProps.stripe.createToken = jest.fn().mockRejectedValue('boo')
    const genericErrorMessage = 'There was an error processing your credit card. Please try again.';

    const wrapper = shallow( <PaymentForm {...defaultProps}/> );

    return wrapper.instance().handleSubmit({preventDefault: () => {} }).then(() => {
        expect(wrapper.state().errors).toEqual([genericErrorMessage]);        
        expect(wrapper.state().submitting).toBeFalsy();
    });
});
