import React from 'react';
import { shallow } from 'enzyme';

import ExistingParkingOrStorage from 'components/profile/options/ExistingParkingOrStorage';


it('shows included and additional if included is less than quantity requested', () => {
    const rentalOption = {
        included: 1,
        monthly_amount: '25.00',
        name: 'Garage Parking',
        id: 123,
    };

    const wrapper = shallow(<ExistingParkingOrStorage quantity={2} rentalOption={rentalOption}/>);

    expect(wrapper.text()).toEqual('Garage Parking1 Included, 1 x $25/mo');
});

it('only renders additionalPaymentDetails text if no included', () => {
    const rentalOption = {
        included: 0,
        monthly_amount: '25.00',
        name: 'Garage Parking',
        id: 123
    };
    const wrapper = shallow(<ExistingParkingOrStorage quantity={2} rentalOption={rentalOption}/>);

    expect(wrapper.text()).toEqual('Garage Parking2 x $25/mo');
});

it('only renders included text if included amount is greater than quantity', () => {
    const rentalOption = {
        included: 2,
        monthly_amount: '25.00',
        name: 'Garage Parking',
        id: 123
    };

    const wrapper = shallow(<ExistingParkingOrStorage quantity={2} rentalOption={rentalOption}/>);

    expect(wrapper.text()).toEqual('Garage Parking2 Included');
});

it('renders $0 if there is no value for monthly_amount', () => {
    const rentalOption = {
        id: 123,
        included: 0,
        monthly_amount: null,
        name: 'Garage Parking',
    };

    const wrapper = shallow(<ExistingParkingOrStorage quantity={2} rentalOption={rentalOption}/>);

    expect(wrapper.text()).toEqual('Garage Parking2 x $0/mo');
})
