import { shallow, mount } from 'enzyme';
import { PaymentDetails } from 'components/payment-details/PaymentDetails';
import React from 'react';
import PaidText from 'components/common/PaidText';

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
                    move_in_fees_v2: {
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
            payables: [{ paid: true }, { paid: true }, { paid: true }],
            fetchPayments: jest.fn(),
        };
    });

    it('renders the correct number of rows', () => {
        const wrapper = shallow(<PaymentDetails {...defaultProps} />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });

    it('renders the "Paid" text if all due at application payments have been paid', () => {
        const wrapper = mount(<PaymentDetails {...defaultProps} />);

        expect(defaultProps.fetchPayments).toBeCalledTimes(1);
        expect(wrapper.find(PaidText).length).toEqual(1);
    });

    it('does not render the "Paid" text if some due at application payments have not been paid', () => {
        const payables = [{ paid: true }, { paid: false }, { paid: true }];

        const wrapper = mount(<PaymentDetails {...{ ...defaultProps, payables }} />);

        expect(defaultProps.fetchPayments).toBeCalledTimes(1);
        expect(wrapper.find(PaidText).length).toEqual(0);
    });

    it('displays terms link when passed payment', () => {
        const applicant = {
            receipt: { id: 123 },
        };
        const wrapper = shallow(<PaymentDetails {...defaultProps} applicant={applicant} />);
        expect(wrapper.text()).toContain('Payment and Holding Deposit Terms');
    });

    it('Does not display terms link when payment is incomplete/pending', () => {
        const applicant = {
            receipt: null,
        };
        const wrapper = shallow(<PaymentDetails {...defaultProps} applicant={applicant} />);
        expect(wrapper.text()).not.toContain('Payment and Holding Deposit Terms');
    });
});
