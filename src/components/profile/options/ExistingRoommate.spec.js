import React from 'react';
import { shallow } from 'enzyme';

import ExistingRoommate from 'components/profile/options/ExistingRoommate';
import mockProfile from 'reducers/mock-profile.json';


it('matches snapshot for unregistered roommate', () => {
    const unregistered = {
            phone_number: "(383) 838-4849",
            first_name: "kreebs",
            last_name: "mcgreebs",
            id: 71,
            is_registered: false,
            status: "Not Started"
    }
    const wrapper = shallow(<ExistingRoommate item={unregistered}/>);
    expect(wrapper.getElement()).toMatchSnapshot();
});


it('matches snapshot for registered roommate', () => {
    const registered = {
            phone_number: "(383) 838-4849",
            first_name: "kreebs",
            last_name: "mcgreebs",
            id: 71,
            is_registered: true,
            status: "Completed"
    }
    const wrapper = shallow(<ExistingRoommate item={registered}/>);
    expect(wrapper.getElement()).toMatchSnapshot();
});
