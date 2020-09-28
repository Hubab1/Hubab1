import React from 'react';
import { shallow } from 'enzyme';
import { PaymentDetailRow, PaymentDetailRows } from 'components/payment-details/PaymentDetailRow';

describe('PaymentDetailRows', () => {
    const paymentObject = {
        items: [
            {
                amount: '125',
                category: '',
                included: 0,
                name: 'Application Fee',
                price: '125',
                quantity: 1,
                type: 'fee',
                paymentTotal: 125
            },
            {
                amount: '1,300',
                category: 'base_rent',
                included: 0,
                name: 'Base Rent',
                price: '1,300',
                quantity: 1,
                type: 'fee',
                paymentTotal: 1300

            },
            {
                amount: '0',
                category: 'Parking',
                included: 1,
                name: 'Covered Parking',
                price: '55',
                quantity: 1,
                type: 'fee',
                paymentTotal: 0
            }
        ],
        paymentType: 'move in',
    };

    it('renders the correct number of rows', () => {
        const props = {
            paymentObject,
            paymentType: 'move in'
        };

        const wrapper = shallow(<PaymentDetailRows {...props} />);

        // Renders each row + total row
        expect(wrapper.find(PaymentDetailRow)).toHaveLength(4);
    });
});

describe('PaymentDetailRow', () => {

    it('should render as expected with quantity 1', () => {
        const props = {
            name: 'Base Rent',
            paymentTotal: '2,200',
            quantity: 1,
            price: '2,200',
            className: 'paymentRow',
        };
        const wrapper = shallow(<PaymentDetailRow {...props} />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });

    it('should render as expected with quantity 10', () => {
        const props = {
            name: 'pets fees',
            paymentTotal: '2,200',
            quantity: 10,
            price: '220',
            className: 'paymentRow'
        };
        const wrapper = shallow(<PaymentDetailRow {...props} />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });

    it('should not render with quantity 0', () => {
        const props = {
            name: 'parking fees',
            paymentTotal: '0',
            quantity: 0,
            price: '220',
            className: 'paymentRow'
        };
        const wrapper = shallow(<PaymentDetailRow {...props} />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });

    it('should render included options', () => {
        const props = {
            name: 'parking fees',
            paymentTotal: '0',
            quantity: 2,
            price: '100',
            included: 5,
            className: 'paymentRow'
        };
        const wrapper = shallow(<PaymentDetailRow {...props} />);

        // included > quantity
        expect(wrapper.getElement()).toMatchSnapshot();

        // included = quantity
        wrapper.setProps({quantity: 5});
        expect(wrapper.getElement()).toMatchSnapshot();

        // included < quantity
        wrapper.setProps({quantity: 8, paymentTotal: '300'});
        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
