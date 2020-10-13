import { shallow } from 'enzyme';
import React from 'react';
import { PaymentDetailsCard, PaymentItemsExpansionPanel } from 'components/payment-details/PaymentDetailsCard';

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
            payables: [{ paid: true }, { paid: true }, { paid: true }],
        };
    });

    it('matches snapshot', () => {
        const wrapper = shallow(<PaymentDetailsCard {...defaultProps} />);
        expect(wrapper.getElement()).toMatchSnapshot();
        expect(wrapper.find(PaymentItemsExpansionPanel)).toHaveLength(3);
    });
});
