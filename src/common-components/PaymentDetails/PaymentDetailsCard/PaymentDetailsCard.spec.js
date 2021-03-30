import React from 'react';
import { shallow } from 'enzyme';

import { PaymentDetailsCard, PaymentItemsExpansionPanel } from './PaymentDetailsCard';

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
