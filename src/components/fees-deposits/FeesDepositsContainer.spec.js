import React from 'react';
import { shallow } from 'enzyme';

import mockProfile from 'reducers/mock-profile';
import mockApplicant from 'reducers/applicant-mock';
import mockPayments from 'reducers/mock-payments';
import { FeesDepositsContainer } from './FeesDepositsContainer';
import FeesDepositsOptions from './FeesDepositsOptions';



let defaultProps;
const everyone = mockProfile.primary_applicant.guarantors.concat(mockProfile.co_applicants);
everyone.unshift(mockApplicant);

beforeEach(() => {
    defaultProps = {
        profile: mockProfile,
        applicant: mockApplicant,
        payments: mockPayments.payables,
    };
});

it('fees are set from profile selected_rental_options', function() {
    let wrapper = shallow( <FeesDepositsContainer {...defaultProps} /> );
    const feesDepositsOptionsComponent = wrapper.find(FeesDepositsOptions);
    expect(feesDepositsOptionsComponent.exists()).toBe(true);
    expect(feesDepositsOptionsComponent.prop('baseAppFee')).toBe(125.5);
    expect(feesDepositsOptionsComponent.prop('holdingDepositAmount')).toBe(501.5);
});
