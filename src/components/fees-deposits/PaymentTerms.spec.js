import React from 'react';
import { shallow, mount } from 'enzyme';
import { TOS_TYPE_PAYMENTS } from 'app/constants';
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
        canProceedToPayment: true,
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
    global.Date.now = jest.fn(() => 1603799364680);

    const wrapper = shallow(<PaymentTerms {...defaultProps} />);
    wrapper.find('ActionButton').simulate('click');
    expect(defaultProps.goToPayment).toHaveBeenCalledWith({
        type: TOS_TYPE_PAYMENTS,
        context: {
            community_name: 'Monterey Pines Apartments',
            holding_deposit: '$500',
            move_in_date: 'October 30, 2020',
            time: 1603799364680,
            unit_number: '24',
        },
    });
});

it('Hide Agree and Continue button when canProceedToPayment is False', () => {
    const wrapper = mount(<PaymentTerms {...defaultProps} canProceedToPayment={false} />);
    expect(wrapper.find('ActionButton').length).toEqual(1);
    expect(wrapper.text()).toContain('Go Back');
    expect(wrapper.text()).not.toContain('Agree and Continue');
});

it('Terms matches snapshot when canProceedToPayment is False', () => {
    const wrapper = shallow(<PaymentTerms {...defaultProps} canProceedToPayment={false} />);
    expect(wrapper.getElement()).toMatchSnapshot();
});
