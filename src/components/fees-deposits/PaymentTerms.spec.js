import React from 'react';
import { shallow } from 'enzyme';

import { PaymentTerms } from './PaymentTerms';
import API from 'app/api';

describe('PaymentTerms', () => {
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

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('Matches snapshot', () => {
        API.fetchHoldingDepositTerms = jest.fn().mockResolvedValue();
        const wrapper = shallow(<PaymentTerms {...defaultProps} />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
