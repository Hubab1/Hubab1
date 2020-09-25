import React from 'react';
import { shallow } from 'enzyme';

import API from 'app/api';
import { GuarantorPage } from 'components/profile/GuarantorPage';
import ConfirmationPage from 'components/common/ConfirmationPage/ConfirmationPage';
import ActionButton from 'components/common/ActionButton/ActionButton';
import { ROUTES, RENTER_PROFILE_TYPE_GUARANTOR } from 'app/constants';


let defaultProps;

beforeEach(() => {
    defaultProps = {
        fetchRenterProfile: jest.fn(),
        history: {
            push: jest.fn(),
        },
        initialPage: '/rental_profile',
        fetchApplicant: jest.fn().mockResolvedValue({}),
    };
});

it('fetches renter profile on submit', function() {
    API.inviteGuarantor = jest.fn().mockResolvedValue({});
    const wrapper = shallow( <GuarantorPage {...defaultProps}/> );
    return wrapper.instance().onSubmit({}, {setSubmitting: jest.fn()}).then(() => {
        expect(defaultProps.fetchRenterProfile).toHaveBeenCalled();
    });
});

it('sets errors on submit if errors returned', function() {
    API.inviteGuarantor = jest.fn().mockResolvedValue({errors: {guarantors: ['not good']}});
    const wrapper = shallow( <GuarantorPage {...defaultProps}/> );
    const setErrors = jest.fn();
    return wrapper.instance().onSubmit({}, {setSubmitting: jest.fn(), setErrors}).then(() => {
        expect(defaultProps.fetchRenterProfile).not.toHaveBeenCalled();
        expect(setErrors).toHaveBeenCalledWith('not good');
    });
});

it('matches snapshot', () => {
    const wrapper = shallow(<GuarantorPage {...defaultProps}/>);
    expect(wrapper.getElement()).toMatchSnapshot();
});

it('Confirmation Page - Add guarantor from rental options', function() {
    const wrapper = shallow( <GuarantorPage {...defaultProps}/> );
    wrapper.setState({ confirmSent: true });
    expect(wrapper.find(ConfirmationPage).exists()).toBeTruthy();
    wrapper.find(ConfirmationPage).dive().find(ActionButton).at(0).simulate('click');
    expect(defaultProps.history.push).toHaveBeenCalledWith(`${ROUTES.PROFILE_OPTIONS}#${RENTER_PROFILE_TYPE_GUARANTOR}`);
});

it('Confirmation Page - Add guarantor after requested', function() {
    const wrapper = shallow( <GuarantorPage {...defaultProps} guarantorRequested={true} /> );
    wrapper.setState({ confirmSent: true });
    expect(wrapper.find(ConfirmationPage).exists()).toBeTruthy();
    wrapper.find(ConfirmationPage).dive().find(ActionButton).at(0).simulate('click');
    expect(defaultProps.fetchApplicant).toHaveBeenCalled();
});
