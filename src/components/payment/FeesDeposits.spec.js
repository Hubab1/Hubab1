import React from 'react';
import { shallow } from 'enzyme';

import mockProfile from 'reducers/mock-profile';
import mockConfig from 'reducers/mock-config';
import mockApplicant from 'reducers/applicant-mock';
import { FeesDeposits } from './FeesDeposits';
import { ApplicationFees } from './ApplicationFees';
import { PaidText } from './PaidText';


let defaultProps;

beforeEach(() => {
    defaultProps = {
        profile: mockProfile,
        configuration: mockConfig,
        applicant: mockApplicant,
    }
})

it('renders ApplicationFees', function() {
    let wrapper = shallow( <FeesDeposits {...defaultProps} /> );
    expect(wrapper.find(ApplicationFees)).toBeTruthy();
});

it('renders Holding Deposit when there is a holding deposit with correct total fees and holding_deposit_paid is false', () => {
    let wrapper = shallow( <FeesDeposits {...defaultProps} /> );
    expect(wrapper.text().includes('Holding Deposit <SimplePopover />$1,000.00')).toBeTruthy();
    expect(wrapper.text().includes('Total$1,100.00')).toBeTruthy();
    expect(wrapper.find(PaidText).length).toBe(0);
})

it('renders Holding Deposit Paid when there is a holding deposit with correct total fees and holding_deposit_paid is true', () => {
    defaultProps.profile.holding_deposit_paid = true;
    let wrapper = shallow( <FeesDeposits {...defaultProps} /> );
    expect(wrapper.text().includes('Holding Deposit <SimplePopover /><PaidText />Total$100.00')).toBeTruthy();
    expect(wrapper.find(PaidText).length).toBe(1);
})

it('does not render Holding Deposit when there is no holding deposit with correct total fees', () => {
    defaultProps.configuration.holding_deposit_value = '';
    let wrapper = shallow( <FeesDeposits {...defaultProps} /> );
    expect(wrapper.text().includes('Holding Deposit <SimplePopover />$1,000.00')).not.toBeTruthy();
    expect(wrapper.text().includes('Total$100.00')).toBeTruthy();
})
