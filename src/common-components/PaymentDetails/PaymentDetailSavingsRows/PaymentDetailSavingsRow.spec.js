import React from 'react';
import { shallow } from 'enzyme';

import { PaymentDetailSavingsRow, PaymentDetailSavingsRows } from './PaymentDetailSavingsRow';

describe('PaymentDetailSavingsRows', () => {
    const paymentObject = {
        items: [
            {
                name: 'Security deposit waiver',
                amount: '2,200',
            },
            {
                name: 'Pet deposit waiver',
                amount: '2,200',
            },
        ],
        paymentType: 'savings',
        total: '4,400',
    };

    it('renders the correct number of rows', () => {
        const props = {
            paymentObject,
            paymentType: 'savings',
        };

        const wrapper = shallow(<PaymentDetailSavingsRows {...props} />);

        // Renders each row + total row
        expect(wrapper.find(PaymentDetailSavingsRow)).toHaveLength(3);
    });
});

describe('PaymentDetailSavingsRow', () => {
    it('should render as expected with price per month', () => {
        const props = {
            name: 'Rental fee waiver',
            paymentTotal: '2,500',
            pricePerMonth: '250',
            months: 10,
        };
        const wrapper = shallow(<PaymentDetailSavingsRow {...props} />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });

    it('should render as expected without price per month', () => {
        const props = {
            name: 'Security deposit waiver',
            paymentTotal: '2,200',
        };
        const wrapper = shallow(<PaymentDetailSavingsRow {...props} />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });

    it('should render rentable item concession correctly', () => {
        const props = {
            name: 'Rentable Item Concession',
            paymentTotal: '500',
        };
        const wrapper = shallow(<PaymentDetailSavingsRow {...props} />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
