import React from 'react';
import { shallow } from 'enzyme';

import API from 'api/api';
import PaymentTerms from './PaymentTerms';
import ActionButton from 'common-components/ActionButton/ActionButton';
import { LinkButton } from 'assets/styles';

describe('PaymentTerms', () => {
    let defaultProps;

    beforeEach(() => {
        defaultProps = {
            handleClickBack: jest.fn(),
            handleTermsAccepted: jest.fn(),
            communityName: 'Monterey Pines Apartments',
            holdingDepositAmount: 500,
            leaseStartDate: '2020-10-30',
            unitNumber: '24',
            canProceedToPayment: true,
            application: {
                id: 123,
            },
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

describe('When handleClickBack is not present', () => {
    let defaultProps;

    beforeEach(() => {
        defaultProps = {
            handleClickBack: null,
            handleTermsAccepted: jest.fn(),
            communityName: 'Monterey Pines Apartments',
            holdingDepositAmount: 500,
            leaseStartDate: '2020-10-30',
            unitNumber: '24',
            canProceedToPayment: true,
            application: {
                id: 123,
            },
        };
    });

    it('hides the Go Back Link', () => {
        const wrapper = shallow(<PaymentTerms {...defaultProps} />);
        expect(wrapper.find('LinkButton')).toHaveLength(0);
    });
});

describe('can proceed to payment', () => {
    let defaultProps;

    beforeEach(() => {
        defaultProps = {
            handleClickBack: jest.fn(),
            handleTermsAccepted: jest.fn(),
            communityName: 'Monterey Pines Apartments',
            holdingDepositAmount: 500,
            leaseStartDate: '2020-10-30',
            unitNumber: '24',
            canProceedToPayment: true,
            application: {
                id: 123,
            },
        };
    });

    it('shows the Agree and Continue Button', () => {
        const wrapper = shallow(<PaymentTerms {...defaultProps} />);
        expect(wrapper.find(ActionButton).first().dive().text()).toBe('Agree and Continue');
        expect(wrapper.find(LinkButton).text()).toBe(' Go Back');
    });
});

describe('cannot proceed to payment', () => {
    let defaultProps;

    beforeEach(() => {
        defaultProps = {
            handleClickBack: jest.fn(),
            handleTermsAccepted: jest.fn(),
            communityName: 'Monterey Pines Apartments',
            holdingDepositAmount: 500,
            leaseStartDate: '2020-10-30',
            unitNumber: '24',
            canProceedToPayment: false,
            application: {
                id: 123,
            },
        };
    });

    it('shows the Agree and Continue Button', () => {
        const wrapper = shallow(<PaymentTerms {...defaultProps} />);
        expect(wrapper.find(ActionButton).first().dive().text()).toBe('Go Back');
    });
});
