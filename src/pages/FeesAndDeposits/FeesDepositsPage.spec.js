import React from 'react';
import { shallow } from 'enzyme';

import { ROLE_CO_APPLICANT } from 'constants/constants';
import mockProfile from 'reducers/fixtures/mock-profile';
import mockApplicant from 'reducers/fixtures/mock-applicant';
import mockPayments from 'reducers/fixtures/mock-payments';

import { FeesDepositsPage } from './FeesDepositsPage';
import FeesDepositsOptions from 'pages/FeesAndDeposits/components/FeesDepositsOptions';

let defaultProps;

beforeEach(() => {
    defaultProps = {
        profile: mockProfile,
        applicant: mockApplicant,
        payments: mockPayments.payables,
        toggleLoader: jest.fn(),
    };
});

it('primary applicant - fees are set from profile selected_rental_options', function () {
    const wrapper = shallow(<FeesDepositsPage {...defaultProps} />);
    const feesDepositsOptionsComponent = wrapper.find(FeesDepositsOptions);
    expect(feesDepositsOptionsComponent.exists()).toBe(true);
    expect(feesDepositsOptionsComponent.prop('baseAppFee')).toBe(125.5);
    expect(feesDepositsOptionsComponent.prop('holdingDepositAmount')).toBe(501.5);
});

it('coapplicant - fees are set from profile selected_rental_options', function () {
    defaultProps.applicant.role = ROLE_CO_APPLICANT;
    const wrapper = shallow(<FeesDepositsPage {...defaultProps} />);
    const feesDepositsOptionsComponent = wrapper.find(FeesDepositsOptions);
    expect(feesDepositsOptionsComponent.exists()).toBe(true);
    expect(feesDepositsOptionsComponent.prop('baseAppFee')).toBe(125.5);
    expect(feesDepositsOptionsComponent.prop('holdingDepositAmount')).toBe(0);
});
