import React from 'react';
import { shallow } from 'enzyme';

import { PaymentForm } from './PaymentForm';
import API from 'app/api';


let defaultProps;
beforeEach(() => {
    defaultProps = {
        applicationFee: 60.567,
        stripe: {createToken: jest.fn().mockResolvedValue({token:{id:123}})}
    }
})

it('handleSubmit sets paymentSuccess to true on Success', function() {
    const wrapper = shallow( <PaymentForm {...defaultProps}/> );

    API.stripePayment = jest.fn().mockResolvedValue({success: 'payment succeeded!'})

    wrapper.instance().handleSubmit({preventDefault: () => {} }).then(() => {
        expect(API.stripePayment).toHaveBeenCalledWith({token: 123});
        expect(wrapper.state().paymentSuccess).toBeTruthy();
        expect(wrapper.state().submitting).toBeFalsy();
    })
    expect(wrapper.state().submitting).toBeTruthy();
});

it('handleSubmit sets error on API fail', function() {
    const wrapper = shallow( <PaymentForm {...defaultProps}/> );

    API.stripePayment = jest.fn().mockResolvedValue({errors: {error: {message: 'dooty doot doot'}}})

    wrapper.instance().handleSubmit({preventDefault: () => {} }).then(() => {
        expect(API.stripePayment).toHaveBeenCalledWith({token: 123});
        expect(wrapper.state().errors).toEqual(['dooty doot doot']);
        expect(wrapper.state().submitting).toBeFalsy();
    })
    expect(wrapper.state().submitting).toBeTruthy();
});

it('handleSubmit sets error on stripe fail', function() {
    defaultProps.stripe.createToken = jest.fn().mockRejectedValue('boo')
    const genericErrorMessage = 'There was an error processing your credit card. Please try again.';

    const wrapper = shallow( <PaymentForm {...defaultProps}/> );

    wrapper.instance().handleSubmit({preventDefault: () => {} }).then(() => {
        expect(wrapper.state().errors).toEqual([genericErrorMessage]);        
        expect(wrapper.state().submitting).toBeFalsy();
    })
    expect(wrapper.state().submitting).toBeTruthy();
});
