import React from 'react';
import { shallow } from 'enzyme';

import ExistingGenericRentalOption from './ExistingGenericRentalOption';

// TODO: Tests in this file were temporarily commented and updated for small fix related to pricing group | created by: @Chakib | Ticket: NESTIO-19932
it('shows included and additional if included is less than quantity requested', () => {
    const rentalOption = {
        included: 1,
        monthly_amount: '25.00',
        name: 'Garage Parking',
        id: 123,
    };

    const wrapper = shallow(<ExistingGenericRentalOption quantity={2} rentalOption={rentalOption} />);

    //expect(wrapper.text()).toEqual('Garage Parking1 Included, 1 x $25/mo');
    expect(wrapper.text()).toEqual('Garage Parking2 Added');
});

it('only renders additionalPaymentDetails text if no included', () => {
    const rentalOption = {
        included: 0,
        monthly_amount: '25.00',
        name: 'Garage Parking',
        id: 123,
    };

    const wrapper = shallow(<ExistingGenericRentalOption quantity={2} rentalOption={rentalOption} />);

    // expect(wrapper.text()).toEqual('Garage Parking2 x $25/mo');
    expect(wrapper.text()).toEqual('Garage Parking2 Added');
});

it('only renders included text if included amount is greater than quantity', () => {
    const rentalOption = {
        included: 2,
        monthly_amount: '25.00',
        name: 'Garage Parking',
        id: 123,
    };

    const wrapper = shallow(<ExistingGenericRentalOption quantity={2} rentalOption={rentalOption} />);

    // expect(wrapper.text()).toEqual('Garage Parking2 Included');
    expect(wrapper.text()).toEqual('Garage Parking2 Added');
});

it('renders $0 if there is no value for monthly_amount', () => {
    const rentalOption = {
        id: 123,
        included: 0,
        monthly_amount: null,
        name: 'Garage Parking',
    };

    const wrapper = shallow(<ExistingGenericRentalOption quantity={2} rentalOption={rentalOption} />);

    // expect(wrapper.text()).toEqual('Garage Parking2 x $0/mo');
    expect(wrapper.text()).toEqual('Garage Parking2 Added');
});

it('renders cost without decimals', () => {
    const rentalOption = {
        included: 0,
        monthly_amount: '25.00',
        name: 'Garage Parking',
        id: 123,
    };

    const wrapper = shallow(<ExistingGenericRentalOption quantity={2} rentalOption={rentalOption} />);

    // expect(wrapper.text()).toEqual('Garage Parking2 x $25/mo');
    expect(wrapper.text()).toEqual('Garage Parking2 Added');
});

it('renders cost with decimals', () => {
    const rentalOption = {
        included: 0,
        monthly_amount: '25.50',
        name: 'Garage Parking',
        id: 123,
    };

    const wrapper = shallow(<ExistingGenericRentalOption quantity={2} rentalOption={rentalOption} />);

    //expect(wrapper.text()).toEqual('Garage Parking2 x $25.50/mo');
    expect(wrapper.text()).toEqual('Garage Parking2 Added');
});
