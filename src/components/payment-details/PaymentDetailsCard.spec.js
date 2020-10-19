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
            payables: [{ paid: true }, { paid: true }, { paid: true }],
        };
    });

    it('matches snapshot without savings', () => {
        const wrapper = shallow(<PaymentDetailsCard {...defaultProps} />);
        expect(wrapper.getElement()).toMatchSnapshot();
        expect(wrapper.find(PaymentItemsExpansionPanel)).toHaveLength(3);
    });

    it('matches snapshot with savings', () => {
        const props = defaultProps;
        props.profile.fees_breakdown.savings = {
            items: [
                {
                    name: 'Rental fee waiver',
                    amount: '2,500',
                    price: '250',
                    months: '10',
                },
                {
                    name: 'Security deposit waiver',
                    amount: '250',
                    price: '250',
                },
            ],
            total: '2,500',
        };
        const wrapper = shallow(<PaymentDetailsCard {...props} />);
        expect(wrapper.getElement()).toMatchSnapshot();
        expect(wrapper.find(PaymentItemsExpansionPanel)).toHaveLength(4);
    });
});
