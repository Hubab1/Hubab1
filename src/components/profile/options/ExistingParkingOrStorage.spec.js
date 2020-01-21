import React from 'react';
import { shallow } from 'enzyme';

import ExistingParkingOrStorage from 'components/profile/options/ExistingParkingOrStorage';


it('shows included and additional if included is less than quantity requested', () => {
    const rentalOptions = [{
        included: 1,
        monthly_amount: '25.00',
        name: 'Garage Parking',
        id: 123
    }];
    const item = { quantity: 2, rental_option: { id: 123 } };

    const wrapper = shallow(<ExistingParkingOrStorage item={item} options={rentalOptions}/>);

    expect(wrapper.text()).toEqual('Garage Parking1 Included, 1 x $25/mo');
});

it('only renders additionalPaymentDetails text if no included', () => {
    const rentalOptions = [{
        included: 0,
        monthly_amount: '25.00',
        name: 'Garage Parking',
        id: 123
    }];
    const item = { quantity: 2, rental_option: { id: 123 } };

    const wrapper = shallow(<ExistingParkingOrStorage item={item} options={rentalOptions}/>);

    expect(wrapper.text()).toEqual('Garage Parking2 x $25/mo');
});

it('only renders included text if included amount is greater than quantity', () => {
    const rentalOptions = [{
        included: 2,
        monthly_amount: '25.00',
        name: 'Garage Parking',
        id: 123
    }];
    const item = { quantity: 2, rental_option: { id: 123 } };

    const wrapper = shallow(<ExistingParkingOrStorage item={item} options={rentalOptions}/>);

    expect(wrapper.text()).toEqual('Garage Parking2 Included');
});