import React from 'react';
import { shallow } from 'enzyme';

import ExistingPet from 'components/profile/options/ExistingPet';

it('renders pet info correctly', () => {
    const petItem = {
        leasing_context: {
            pets: [{
                key:"first-pet",
                name:"stuart",
                weight:"12",
                breed:"chiwowzerz",
                pet_type:"Dog",
                service_animal:"true",
            }]
        }
    }
    const wrapper = shallow(<ExistingPet item={petItem}/>);
    expect(wrapper.text()).toEqual('Dog - Service Animalstuart, chiwowzerz, 12lbs');
});