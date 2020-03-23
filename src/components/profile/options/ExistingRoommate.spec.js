import React from 'react';
import { shallow } from 'enzyme';

import ExistingRoommate from 'components/profile/options/ExistingRoommate';
import { MILESTONE_APPLICANT_SUBMITTED, MILESTONE_APPLICATION_FEE_COMPLETED } from 'app/constants';

it('matches snapshot for unregistered roommate', () => {
    const unregistered = {
        phone_number: "(383) 838-4849",
        first_name: "kreebs",
        last_name: "mcgreebs",
        id: 71,
        is_registered: false,
        last_milestone: null,
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
        last_milestone: {event: MILESTONE_APPLICANT_SUBMITTED}
    }
    const wrapper = shallow(<ExistingRoommate item={registered}/>);
    expect(wrapper.getElement()).toMatchSnapshot();
});

it('matches snapshot for roommate in progress', () => {
    const registered = {
        phone_number: "(383) 838-4849",
        first_name: "kreebs",
        last_name: "mcgreebs",
        id: 71,
        is_registered: true,
        last_milestone: {event: MILESTONE_APPLICATION_FEE_COMPLETED}
    }
    const wrapper = shallow(<ExistingRoommate item={registered}/>);
    expect(wrapper.getElement()).toMatchSnapshot();
});
