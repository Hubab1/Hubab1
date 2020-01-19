import React from 'react';
import { shallow } from 'enzyme';

import ExistingPet from 'components/profile/options/ExistingPet';
import { RENTAL_OPTIONS_PETS_DOGS } from 'app/constants';


it('renders pet info correctly', () => {
    const petItem = {
                key:"first-pet",
                name:"stuart",
                weight:"12",
                breed:"chiwowzerz",
                pet_type:RENTAL_OPTIONS_PETS_DOGS,
                service_animal:"true",
    };
    const wrapper = shallow(<ExistingPet item={petItem}/>);
    expect(wrapper.text()).toEqual('Dog - Service Animalstuart, chiwowzerz, 12lbs');
});