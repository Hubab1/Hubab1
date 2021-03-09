import React from 'react';
import { shallow } from 'enzyme';

import mockReceipt from 'reducers/tests/mock-receipt';
import mockProfile from 'reducers/tests/mock-profile';
import mockApplicant from 'reducers/tests/mock-applicant';

import { FeesDepositsReceipt } from './FeesDepositsReceipt';
import { ApplicationFees } from 'pages/FeesAndDeposits/components/ApplicationFees/ApplicationFees';
import { HoldingDeposit } from 'pages/FeesAndDeposits/components/HoldingDeposit/HoldingDeposit';

let defaultProps;
const everyone = mockProfile.primary_applicant.guarantors
    .concat(mockProfile.co_applicants)
    .concat(mockProfile.occupants);
everyone.unshift(mockApplicant);

beforeEach(() => {
    defaultProps = {
        baseAppFee: 100,
        handleContinue: jest.fn(),
        email: 'slkejhfkajshefjkhek@gm.com',
        receipt: mockReceipt,
        everyone: everyone,
    };
});

it('renders expected headings text', () => {
    const wrapper = shallow(<FeesDepositsReceipt {...defaultProps} />);

    expect(wrapper.text().includes('Payment Successful!')).toBeTruthy();
    expect(wrapper.text().includes('Payment Summary')).toBeTruthy();
});

it('renders receipt information as expected with holding deposit', () => {
    const wrapper = shallow(<FeesDepositsReceipt {...defaultProps} />);

    expect(
        wrapper
            .text()
            .includes('Payment Successful!Thank you! We emailed a receipt to slkejhfkajshefjkhek@gm.comPayment Summary')
    ).toBeTruthy();

    expect(wrapper.text().includes('Total$1,300')).toBeTruthy();
    expect(wrapper.find(ApplicationFees).props().everyone.length).toEqual(3);
    expect(wrapper.find(HoldingDeposit).props().holdingDepositAmount).toEqual('$1,000');
});

it('renders receipt information as expected when one applicant fee on receipt, no holding deposit', () => {
    const receipt = {
        line_items: [
            {
                id: '12',
                type: '10',
                invoice: '666',
                applicant: '18',
                invitee: null,
                amount: 100.0,
                paid: true,
                stripe_id: '932923482jdf33',
            },
        ],
        paid: true,
        id: 123,
        application: { id: 234 },
        total: 200.5,
        stripe_id: '932923482jdf33',
        paid_by: 18,
    };
    const wrapper = shallow(<FeesDepositsReceipt {...defaultProps} payments={null} receipt={receipt} />);
    expect(wrapper.text().includes('Total$200.50')).toBeTruthy();
    expect(wrapper.find(ApplicationFees).props().everyone.length).toEqual(1);
    expect(wrapper.find(HoldingDeposit).length).toEqual(0);
});

it('does not render total when passed paidByAnother, and shows correct alternate h3 text', () => {
    const wrapper = shallow(<FeesDepositsReceipt {...defaultProps} paidByAnother={true} />);

    expect(wrapper.text().includes('Your roommates have paid all the application fees!')).toBeTruthy();
    expect(wrapper.text().includes('Total')).not.toBeTruthy();
});
