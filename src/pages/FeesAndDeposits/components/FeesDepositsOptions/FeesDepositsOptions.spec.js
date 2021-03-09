import React from 'react';
import { shallow } from 'enzyme';

import mockProfile from 'reducers/tests/mock-profile';
import mockApplicant from 'reducers/tests/mock-applicant';
import mockPayments from 'reducers/tests/mock-payments';
import { FeesDepositsOptions } from './FeesDepositsOptions';
import { PaidText } from 'common-components/PaidText/PaidText';
import { BackLink } from 'common-components/BackLink/BackLink';
import { ApplicationFees } from 'pages/FeesAndDeposits/components/ApplicationFees/ApplicationFees';
import { HoldingDeposit } from 'pages/FeesAndDeposits/components/HoldingDeposit/HoldingDeposit';

let defaultProps;
const everyone = mockProfile.primary_applicant.guarantors
    .concat(mockProfile.co_applicants)
    .concat(mockProfile.occupants);
everyone.unshift(mockApplicant);

beforeEach(() => {
    defaultProps = {
        profile: mockProfile,
        holdingDepositAmount: 1000.0,
        applicant: mockApplicant,
        payments: mockPayments.payables,
        everyone: everyone,
        baseAppFee: 100.55,
        handleContinue: jest.fn(),
        communityName: 'Monterey Pines Apartments',
        unitNumber: '24',
    };
});

it('renders ApplicationFees', function () {
    const wrapper = shallow(<FeesDepositsOptions {...defaultProps} />);
    expect(wrapper.find(ApplicationFees)).toBeTruthy();
    expect(wrapper.text().includes('Monterey Pines Apartments Unit 24')).toBeTruthy();
});

it('renders Holding Deposit when there is a holding deposit with correct total fees and paid holding deposit in payments', () => {
    defaultProps.holdingDepositAmount = 1000.0;
    const payments = [
        {
            id: '12',
            type: '10',
            invoice: '666',
            applicant: '18',
            invitee: null,
            amount: 100.0,
            paid: false,
            stripe_id: '',
        },
    ];
    const wrapper = shallow(<FeesDepositsOptions {...defaultProps} payments={payments} />);
    expect(wrapper.find(HoldingDeposit)).toBeTruthy();
    expect(wrapper.text().includes('Total$1,100')).toBeTruthy();
    expect(wrapper.find(PaidText).length).toBe(0);
});

it('renders Holding Deposit Paid when there is a holding deposit with correct total fees and holding deposit payment paid is true', () => {
    const payments = [
        {
            id: '12',
            type: '10',
            invoice: '666',
            applicant: '18',
            invitee: null,
            amount: 100.0,
            paid: false,
            stripe_id: '',
        },
        {
            id: '13',
            type: '20',
            invoice: '666',
            applicant: '18',
            invitee: null,
            amount: 1000.0,
            paid: true,
            stripe_id: '',
        },
    ];
    const wrapper = shallow(<FeesDepositsOptions {...defaultProps} payments={payments} />);

    expect(wrapper.find(HoldingDeposit)).toBeTruthy();
    expect(wrapper.find(HoldingDeposit).props().holdingDepositPaid).toEqual(true);
    expect(wrapper.text().includes('Total$100.55')).toBeTruthy();
});

it('does not render Holding Deposit when there is no holding deposit with correct total fees', () => {
    defaultProps.holdingDepositAmount = '';
    const payments = [
        {
            id: '12',
            type: '10',
            invoice: '666',
            applicant: '18',
            invitee: null,
            amount: 100.0,
            paid: false,
            stripe_id: '',
        },
    ];
    const wrapper = shallow(<FeesDepositsOptions {...defaultProps} payments={payments} />);

    expect(wrapper.text().includes('Holding Deposit <SimplePopover />$1000')).not.toBeTruthy();
    expect(wrapper.text().includes('Total$100')).toBeTruthy();
});

it('does not render Total when no holding deposit and fees are paid', () => {
    defaultProps.holdingDepositAmount = '';
    const payments = [
        {
            id: '12',
            type: '10',
            invoice: '666',
            applicant: '18',
            invitee: null,
            amount: 100.0,
            paid: true,
            stripe_id: '',
        },
    ];
    const wrapper = shallow(<FeesDepositsOptions {...defaultProps} payments={payments} />);

    expect(wrapper.text().includes('Total')).not.toBeTruthy();
});

it('does not render Total when holding deposit paid and fees are paid', () => {
    defaultProps.holdingDepositAmount = 1000;
    defaultProps.payments[0].paid = true;
    defaultProps.payments[1].paid = true;
    const wrapper = shallow(<FeesDepositsOptions {...defaultProps} />);
    expect(wrapper.text().includes('Total')).not.toBeTruthy();
});

it('renders expected header text', () => {
    const payments = [
        {
            id: '12',
            type: '10',
            invoice: '666',
            applicant: '18',
            invitee: null,
            amount: 100.0,
            paid: true,
            stripe_id: '',
        },
    ];

    const wrapper = shallow(<FeesDepositsOptions {...defaultProps} payments={payments} receipt={null} />);

    expect(wrapper.text().includes('Application Fees and Holding Deposit')).toBeTruthy();
    expect(wrapper.text().includes('Fees and Deposits')).toBeTruthy();
});

it('renders the back button', () => {
    defaultProps.isOutstanding = false;
    const wrapper = shallow(<FeesDepositsOptions {...defaultProps} receipt={null} />);

    expect(wrapper.find(BackLink).length === 1).toBeTruthy();
});

describe('oustanding balance state', () => {
    it('renders outstanding balance header and text', () => {
        defaultProps.isOutstanding = true;
        const wrapper = shallow(<FeesDepositsOptions {...defaultProps} receipt={null} />);

        expect(wrapper.text().includes('Outstanding Balance')).toBeTruthy();
        expect(
            wrapper
                .text()
                .includes(
                    'It looks like you have some outstanding fees/deposits. Let’s settle up so you can move forward with your application.'
                )
        ).toBeTruthy();
    });

    it('does not render the back button', () => {
        defaultProps.isOutstanding = true;
        const wrapper = shallow(<FeesDepositsOptions {...defaultProps} receipt={null} />);

        expect(wrapper.find(BackLink).length === 0).toBeTruthy();
    });
});
