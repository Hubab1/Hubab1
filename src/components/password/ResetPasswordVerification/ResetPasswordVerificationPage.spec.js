import React from 'react';
import { shallow } from 'enzyme';

import API from 'app/api';
import { ResetPasswordVerificationPage } from './ResetPasswordVerificationPage';

let defaultProps;
beforeEach(() => {
    defaultProps = {
        communityId: '1',
        fetchRenterProfile: jest.fn(),
        history: {location: {pathname: '/password/verify', search: '', hash: '', state: {phoneNumber: '(222) 222-2222'}}},
        profile: null
    };
});

it('renders phone number in text', () => {
    const wrapper = shallow(<ResetPasswordVerificationPage {...defaultProps}/>);
    expect(wrapper.text().includes(defaultProps.history.location.state.phoneNumber)).toBeTruthy();
});

it('onSubmit calls API.passwordResetVerification', () => {
    const phoneNumber = defaultProps.history.location.state.phoneNumber;

    const wrapper = shallow(<ResetPasswordVerificationPage {...defaultProps}/>);
    API.passwordResetVerification = jest.fn().mockReturnValue(Promise.resolve());
    wrapper.instance().onSubmit({ resetCode: '666666' }, { setSubmitting: function() {}, setErrors: function() {} });
    expect(API.passwordResetVerification).toHaveBeenCalledWith(phoneNumber, '666666', defaultProps.communityId);

});

it('clicking Resend Here calls API.passwordResetRequest', () => {
    const phoneNumber = defaultProps.history.location.state.phoneNumber;

    const wrapper = shallow(<ResetPasswordVerificationPage {...defaultProps}/>);
    API.passwordResetRequest = jest.fn().mockReturnValue(Promise.resolve());
    wrapper.find('LinkButton').simulate('click');
    expect(API.passwordResetRequest).toHaveBeenCalledWith(phoneNumber, defaultProps.communityId);
});
