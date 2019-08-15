import React from 'react';
import { shallow } from 'enzyme';

import mockProfile from 'reducers/mock-profile';
import mockConfig from 'reducers/mock-config';
import { PaymentOptionsPage } from './PaymentOptionsPage';
import { ApplicationFees } from './ApplicationFees';


let defaultProps;

beforeEach(() => {
    defaultProps = {
        profile: mockProfile,
        configuration: mockConfig
    }
})

it('renders ApplicationFees', function() {
    let wrapper = shallow( <PaymentOptionsPage {...defaultProps} /> );
    expect(wrapper.find(ApplicationFees)).toBeTruthy();
});

it('renders Holding Deposit when there is a holding deposit with correct total fees', () => {
    let wrapper = shallow( <PaymentOptionsPage {...defaultProps} /> );
    expect(wrapper.text().includes('Holding Deposit <SimplePopover />$1,000.00')).toBeTruthy();
    expect(wrapper.text().includes('Total$1,100.00')).toBeTruthy();
})

it('does not render Holding Deposit when there is no holding deposit with correct total fees', () => {
    defaultProps.configuration.holding_deposit_value = '';
    let wrapper = shallow( <PaymentOptionsPage {...defaultProps} /> );
    expect(wrapper.text().includes('Holding Deposit <SimplePopover />$1,000.00')).not.toBeTruthy();
    expect(wrapper.text().includes('Total$100.00')).toBeTruthy();
})
