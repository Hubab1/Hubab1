import React from 'react';
import { shallow } from 'enzyme';

import { PersonRow } from './PersonRow';
import { ROLE_PRIMARY_APPLICANT, ROLE_COAPPLICANT } from 'app/constants';
import { LinkButton } from 'assets/styles';


let defaultProps;

beforeEach( () => {
    defaultProps = {
        person: {
            "phone_number": "(383) 838-4849",
            "first_name": "kreebs",
            "last_name": "mcgreebs",
            "id": 71,
            "is_registered": false
        },
        label: "Roommate",
        role: ROLE_PRIMARY_APPLICANT,
        handleClick: jest.fn()

    }
})

describe('When logged in applicant is primary applicant, ', () => {
    it('renders PersonRow for co_applicant who has not registered with appropriate text and LinkButton', () => {
        const wrapper = shallow(<PersonRow {...defaultProps}/>);

        expect(wrapper.find(LinkButton).length).toEqual(1);
        expect(wrapper.text().includes('kreebs mcgreebsRoommate')).toBeTruthy();
    })

    it('renders PersonRow for co_applicant who has registered with appropriate text and no LinkButton', () => {
        defaultProps.person.is_registered = true;
        const wrapper = shallow(<PersonRow {...defaultProps}/>);

        expect(wrapper.find(LinkButton).length).toEqual(0);
        expect(wrapper.text().includes('kreebs mcgreebsRoommate')).toBeTruthy();
    })

    it('renders PersonRow for guarantor who has registered with appropriate text and no LinkButton', () => {
        defaultProps.person.is_registered = true;
        defaultProps.label = "Guarantor";
        const wrapper = shallow(<PersonRow {...defaultProps}/>);

        expect(wrapper.find(LinkButton).length).toEqual(0);
        expect(wrapper.text().includes('kreebs mcgreebsGuarantor')).toBeTruthy();
    })

    it('renders PersonRow for guarantor who has not registered with appropriate text and LinkButton', () => {
        defaultProps.person.is_registered = false;
        defaultProps.label = "Guarantor";

        const wrapper = shallow(<PersonRow {...defaultProps}/>);

        expect(wrapper.find(LinkButton).length).toEqual(1);
        expect(wrapper.text().includes('kreebs mcgreebsGuarantor')).toBeTruthy();
    })

    it('renders PersonRow for main applicant with appropriate text and no LinkButton', () => {
        defaultProps.person.is_registered = false;
        defaultProps.label = "Main Applicant";

        const wrapper = shallow(<PersonRow {...defaultProps}/>);

        expect(wrapper.find(LinkButton).length).toEqual(0);
        expect(wrapper.text().includes('kreebs mcgreebsMain Applicant')).toBeTruthy();
    })
});

describe('When logged in applicant is not primary applicant, ', () => {
    it('does not render resend links for applicant who has not registered', () => {
        defaultProps.role = ROLE_COAPPLICANT;
        const wrapper = shallow(<PersonRow {...defaultProps}/>);

        expect(wrapper.find(LinkButton).length).toEqual(0);
    })
});