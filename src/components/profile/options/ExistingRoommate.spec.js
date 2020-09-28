import React from 'react';
import { shallow } from 'enzyme';

import ExistingRoommate from 'components/profile/options/ExistingRoommate';
import {
    MILESTONE_APPLICANT_SUBMITTED,
    MILESTONE_APPLICATION_FEE_COMPLETED,
    RENTER_PROFILE_TYPE_CO_APPLICANTS,
    RENTER_PROFILE_TYPE_GUARANTOR,
    RENTER_PROFILE_TYPE_DEPENDENT
} from 'app/constants';

it('matches snapshot for unregistered roommate', () => {
    const unregistered = {
        phone_number: '(383) 838-4849',
        first_name: 'kreebs',
        last_name: 'mcgreebs',
        id: 71,
        is_registered: false,
        last_milestone: null,
    };
    const wrapper = shallow(<ExistingRoommate item={unregistered} type={RENTER_PROFILE_TYPE_CO_APPLICANTS}/>);
    expect(wrapper.getElement()).toMatchSnapshot();
});


it('matches snapshot for registered roommate', () => {
    const registered = {
        phone_number: '(383) 838-4849',
        first_name: 'kreebs',
        last_name: 'mcgreebs',
        id: 71,
        is_registered: true,
        last_milestone: {event: MILESTONE_APPLICANT_SUBMITTED}
    };
    const wrapper = shallow(<ExistingRoommate item={registered} type={RENTER_PROFILE_TYPE_CO_APPLICANTS}/>);
    expect(wrapper.getElement()).toMatchSnapshot();
});

it('matches snapshot for roommate in progress', () => {
    const registered = {
        phone_number: '(383) 838-4849',
        first_name: 'kreebs',
        last_name: 'mcgreebs',
        id: 71,
        is_registered: true,
        last_milestone: {event: MILESTONE_APPLICATION_FEE_COMPLETED}
    };
    const wrapper = shallow(<ExistingRoommate item={registered} type={RENTER_PROFILE_TYPE_CO_APPLICANTS}/>);
    expect(wrapper.getElement()).toMatchSnapshot();
});

it('doesnt show resend / edit for dependents', () => {
    const props = {
        item: {
            phone_number: '(383) 838-4849',
            first_name: 'kreebs',
            last_name: 'mcgreebs',
            id: 71
        },
    };
    let wrapper = shallow(<ExistingRoommate {...props} type={RENTER_PROFILE_TYPE_CO_APPLICANTS} />);
    expect(wrapper.text()).toContain('Resend');
    wrapper = shallow(<ExistingRoommate {...props} type={RENTER_PROFILE_TYPE_DEPENDENT} />);
    expect(wrapper.text()).not.toContain('Resend');
});

it('can remove invitee while he didnt start his application', () => {
    const props = {
        item: {
            phone_number: '(383) 838-4849',
            first_name: 'kreebs',
            last_name: 'mcgreebs',
            id: 71,
            last_milestone: null
        },
    };
    const wrapper = shallow(<ExistingRoommate {...props} type={RENTER_PROFILE_TYPE_GUARANTOR} />);
    expect(wrapper.text()).toContain('Remove');
});

it('can not remove invitee while he already started his application', () => {
    const props = {
        item: {
            phone_number: '(383) 838-4849',
            first_name: 'kreebs',
            last_name: 'mcgreebs',
            id: 71,
            last_milestone: {event: MILESTONE_APPLICANT_SUBMITTED}
        },
    };
    const wrapper = shallow(<ExistingRoommate {...props} type={RENTER_PROFILE_TYPE_GUARANTOR} />);
    expect(wrapper.text()).not.toContain('Remove');
});
