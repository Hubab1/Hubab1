import React from 'react';
import { shallow, mount } from 'enzyme';

import { PaymentDetailsPage } from './PaymentDetailsPage';
import PaidText from 'common-components/PaidText/PaidText';

describe('PaymentDetails', () => {
    let defaultProps;

    beforeEach(() => {
        defaultProps = {
            profile: {
                lease_start_date: '2020-12-15',
                unit: {
                    unit_number: 1,
                },
                lease_term: 12,
                fees_breakdown: {
                    application_fees: {
                        total: '620',
                        items: [],
                    },
                    move_in_fees: {
                        total: '0',
                        items: [],
                    },
                    monthly_fees: {
                        total: '1234',
                        items: [],
                    },
                },
            },
            configuration: {},
            fetchPayments: jest.fn(),
            applicationFees: {
                total: 620,
                allPaid: true,
                items: [
                    {
                        name: 'Application Fee',
                        amount: 500,
                        quantity: 4,
                        price: 125,
                        type: 'fee',
                    },
                    {
                        name: 'Holding Deposit',
                        amount: 120,
                        quantity: 1,
                        price: 120,
                        type: 'fee',
                    },
                ],
            },
        };
    });

    it('renders the correct number of rows', () => {
        const wrapper = shallow(<PaymentDetailsPage {...defaultProps} />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });

    it('renders the "Paid" text if all due at application payments have been paid', () => {
        const wrapper = mount(<PaymentDetailsPage {...defaultProps} />);

        expect(defaultProps.fetchPayments).toBeCalledTimes(1);
        expect(wrapper.find(PaidText).length).toEqual(1);
    });

    it('does not render the "Paid" text if applicationFees.allPaid is false', () => {
        const applicationFees = { ...defaultProps.applicationFees, allPaid: false };

        const wrapper = mount(<PaymentDetailsPage {...{ ...defaultProps, applicationFees }} />);

        expect(defaultProps.fetchPayments).toBeCalledTimes(1);
        expect(wrapper.find(PaidText).length).toEqual(0);
    });

    it('displays terms link when passed payment', () => {
        const applicant = {
            receipt: { id: 123 },
        };
        const wrapper = shallow(<PaymentDetailsPage {...defaultProps} applicant={applicant} />);
        expect(wrapper.text()).toContain('Payment and Holding Deposit Terms');
    });

    it('Does not display terms link when payment is incomplete/pending', () => {
        const applicant = {
            receipt: null,
        };
        const wrapper = shallow(<PaymentDetailsPage {...defaultProps} applicant={applicant} />);
        expect(wrapper.text()).not.toContain('Payment and Holding Deposit Terms');
    });
});
