import React from 'react';
import { shallow } from 'enzyme';

import API from 'app/api';
import { GuarantorPage } from 'components/profile/GuarantorPage';


let defaultProps;

beforeEach(() => {
    defaultProps = {
        fetchRenterProfile: jest.fn(),
    }
})

it('fetches renter profile on submit', function() {
    API.inviteGuarantor = jest.fn().mockResolvedValue({});
    let wrapper = shallow( <GuarantorPage {...defaultProps}/> );
    return wrapper.instance().onSubmit({}, {setSubmitting: jest.fn()}).then(() => {
        expect(defaultProps.fetchRenterProfile).toHaveBeenCalled();
    })
});

it('sets errors on submit if errors returned', function() {
    API.inviteGuarantor = jest.fn().mockResolvedValue({errors: {guarantors: ['not good']}});
    let wrapper = shallow( <GuarantorPage {...defaultProps}/> );
    const setErrors = jest.fn();
    return wrapper.instance().onSubmit({}, {setSubmitting: jest.fn(), setErrors}).then(() => {
        expect(defaultProps.fetchRenterProfile).not.toHaveBeenCalled();
        expect(setErrors).toHaveBeenCalledWith('not good');
    })
});

it('matches snapshot', () => {
    const wrapper = shallow(<GuarantorPage {...defaultProps}/>);
    expect(wrapper.getElement()).toMatchSnapshot();
});
