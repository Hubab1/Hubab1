import React from 'react';
import { shallow } from 'enzyme';

import { PaymentTerms } from './PaymentTerms';

let defaultProps;
beforeEach(() => {
    defaultProps = {
        handleClickBack: jest.fn(),
        goToPayment: jest.fn(),
        communityName: 'Monterey Pines Apartments',
        holdingDepositAmount: 500,
        leaseStartDate: '2020-10-30',
        unitNumber: '24',
    };
});

it('calls handleClickBack when Go Back is clicked', () => {
    const wrapper = shallow(<PaymentTerms {...defaultProps} />);
    expect(wrapper.getElement()).toMatchSnapshot();
});

it('calls handleClickBack when Go Back is clicked', () => {
    const wrapper = shallow(<PaymentTerms {...defaultProps} />);

    wrapper.find('LinkButton').simulate('click');
    expect(defaultProps.handleClickBack).toHaveBeenCalled();
});

it('calls goToPayment when Go Back is clicked', () => {
    const wrapper = shallow(<PaymentTerms {...defaultProps} />);

    wrapper.find('ActionButton').simulate('click');
    expect(defaultProps.goToPayment).toHaveBeenCalled();
});
