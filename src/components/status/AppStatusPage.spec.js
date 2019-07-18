import React from 'react';
import { shallow } from 'enzyme';
import { Link } from 'react-router-dom';

import { AppStatusPage } from './AppStatusPage';
import mockProfile from 'reducers/mock-profile';
import mockConfig from 'reducers/mock-config';
import mockApplicant from 'reducers/applicant-mock';



let defaultProps;
beforeEach(() => {
    defaultProps = {
        profile: mockProfile,
        configuration: mockConfig,
        applicant: mockApplicant,
    }
});

it('renders people with with correct labels', () => {
    const wrapper = shallow(<AppStatusPage {...defaultProps}/>);

    expect(wrapper.text().includes('frank underwoodMain Applicant')).toBeTruthy();
    expect(wrapper.text().includes('kreebs mcgreebsRoommate')).toBeTruthy();
    expect(wrapper.text().includes('jerry maguireRoommate')).toBeTruthy();
    expect(wrapper.text().includes('elvish parsleyGuarantor')).toBeTruthy();
});

it('renders resend Links for people (co_applicants and guarantor) who have not registerd to correct locations with initialValues', () => {
    const wrapper = shallow(<AppStatusPage {...defaultProps}/>);

    expect(wrapper.find(Link).length).toEqual(2);

    const expectedGuarantorLinkState = {
        "pathname": "/profile/guarantor", 
        "state": {
            "initialValues": {
                "first_name": "elvish", 
                "id": 74, 
                "is_registered": false, 
                "last_name": "parsley", 
                "phone_number": "(222) 111-0000"
            }
        }
    }

    const guarantorRow = wrapper.instance().renderPersonRow(defaultProps.profile.guarantor, 'Guarantor')
    const guarantorLinkDiv = guarantorRow.props.children[1];
    const guarantorLink = guarantorLinkDiv.props.children;
    expect(guarantorLink.type).toEqual(Link);
    expect(guarantorLink.props.to).toEqual(expectedGuarantorLinkState);

    const expectedRoommateLinkState = {
        "pathname": "/profile/invite-coapplicants", 
        "state": {
            "initialValues": {
                "first_name": "kreebs", 
                "id": 71, 
                "is_registered": false, 
                "last_name": "mcgreebs", 
                "phone_number": "(383) 838-4849"
            }
        }
    };

    const unregisteredRoommate = defaultProps.profile.co_applicants[0]
    const roommateRow = wrapper.instance().renderPersonRow(unregisteredRoommate, 'Roommate')
    const roommateLinkDiv = roommateRow.props.children[1];
    const roommateLink = roommateLinkDiv.props.children;
    expect(roommateLink.type).toEqual(Link);
    expect(roommateLink.props.to).toEqual(expectedRoommateLinkState);

});

it('does not render resend links if applicant is not main applicant', () => {
    defaultProps.applicant.role = 'not_main_applicant';

    const wrapper = shallow(<AppStatusPage {...defaultProps}/>);

    expect(wrapper.find(Link).length).toEqual(0);

})