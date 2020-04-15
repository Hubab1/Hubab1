import React from 'react';
import { shallow } from 'enzyme';
import { AppCancelled } from './AppCancelled';


const buildProps = (buildingName = 'Fake Building', streetAddress = '123 Fake Street', unitNumber = '2B') => {
    return {
        profile: {
            events: [{event: '270'}],
            unit: {
                unit_number: unitNumber,
            },
        },
        configuration: {
            community: {
                building_name: buildingName,
                normalized_street_address: streetAddress,
                contact_phone: '1234445510'
            }
        },
    }
};

it('matches snapshot', () => {
    const wrapper = shallow(<AppCancelled {...buildProps()}/>);
    expect(wrapper.getElement()).toMatchSnapshot();
});
