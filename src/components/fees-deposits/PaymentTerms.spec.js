import React from 'react';
import { mount } from 'enzyme';
import { PaymentTerms } from './PaymentTerms';
import API from 'app/api';

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
    API.fetchHoldingDepositTerms = jest.fn().mockResolvedValue('');
});

it('Matches snapshot', () => {
    const wrapper = mount(<PaymentTerms {...defaultProps} />);
    expect(wrapper.getElement()).toMatchSnapshot();
});

it('Matches snapshot when reagreeing', () => {
    const wrapper = mount(
        <PaymentTerms {...defaultProps} isReagreeing={true} reagree={() => {}} canProceedToPayment={true} />
    );
    expect(wrapper.getElement()).toMatchSnapshot();
});
