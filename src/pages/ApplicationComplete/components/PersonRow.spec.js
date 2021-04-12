import React from 'react';
import { shallow } from 'enzyme';
import { Link } from 'react-router-dom';

import { PersonRow } from './PersonRow';
import {
    ROLE_PRIMARY_APPLICANT,
    ROLE_COAPPLICANT,
    MILESTONE_APPLICANT_SUBMITTED,
    MILESTONE_RENTAL_PROFILE_COMPLETED,
} from 'constants/constants';

let defaultProps;

beforeEach(() => {
    defaultProps = {
        person: {
            phone_number: '(383) 838-4849',
            first_name: 'kreebs',
            last_name: 'mcgreebs',
            id: 71,
            is_registered: false,
            last_milestone: null,
        },
        label: 'Roommate',
        role: ROLE_PRIMARY_APPLICANT,
        handleClick: jest.fn(),
        application: {
            id: 123,
        },
    };
});

describe('When logged in applicant is primary applicant, ', () => {
    it('renders PersonRow for co_applicant who has not registered with appropriate text and Link', () => {
        const wrapper = shallow(<PersonRow {...defaultProps} />);

        expect(wrapper.find(Link).length).toEqual(1);
        expect(wrapper.text().includes('kreebs mcgreebsRoommate')).toBeTruthy();
    });

    it('renders PersonRow for co_applicant who has registered with appropriate text and no Link', () => {
        defaultProps.person.is_registered = true;
        const wrapper = shallow(<PersonRow {...defaultProps} />);

        expect(wrapper.find(Link).length).toEqual(0);
        expect(wrapper.text().includes('kreebs mcgreebsRoommate')).toBeTruthy();
    });

    it('renders PersonRow for occupant who has registered with appropriate text and no Link', () => {
        defaultProps.person.is_registered = true;
        defaultProps.label = 'Occupant';
        const wrapper = shallow(<PersonRow {...defaultProps} />);

        expect(wrapper.find(Link).length).toEqual(0);
        expect(wrapper.text().includes('kreebs mcgreebsOccupant')).toBeTruthy();
    });

    it('renders PersonRow for occupant who has not registered with appropriate text and Link', () => {
        defaultProps.person.is_registered = false;
        defaultProps.label = 'Occupant';

        const wrapper = shallow(<PersonRow {...defaultProps} />);

        expect(wrapper.find(Link).length).toEqual(0);
        expect(wrapper.text().includes('kreebs mcgreebsOccupant')).toBeTruthy();
    });

    it('renders PersonRow for guarantor who has registered with appropriate text and no Link', () => {
        defaultProps.person.is_registered = true;
        defaultProps.label = 'Guarantor';
        const wrapper = shallow(<PersonRow {...defaultProps} />);

        expect(wrapper.find(Link).length).toEqual(0);
        expect(wrapper.text().includes('kreebs mcgreebsGuarantor')).toBeTruthy();
    });

    it('renders PersonRow for guarantor who has not registered with appropriate text and Link', () => {
        defaultProps.person.is_registered = false;
        defaultProps.label = 'Guarantor';

        const wrapper = shallow(<PersonRow {...defaultProps} />);

        expect(wrapper.find(Link).length).toEqual(1);
        expect(wrapper.text().includes('kreebs mcgreebsGuarantor')).toBeTruthy();
    });

    it('renders PersonRow for main applicant with appropriate text and no Link', () => {
        defaultProps.person.is_registered = false;
        defaultProps.label = 'Main Applicant';

        const wrapper = shallow(<PersonRow {...defaultProps} />);

        expect(wrapper.find(Link).length).toEqual(0);
        expect(wrapper.text().includes('kreebs mcgreebsMain Applicant')).toBeTruthy();
    });
});

describe('When logged in applicant is not primary applicant, ', () => {
    it('does not render resend links for applicant who has not registered', () => {
        defaultProps.role = ROLE_COAPPLICANT;
        const wrapper = shallow(<PersonRow {...defaultProps} />);

        expect(wrapper.find(Link).length).toEqual(0);
    });
});

describe('status', () => {
    it('shows complete status', () => {
        defaultProps.role = ROLE_COAPPLICANT;
        defaultProps.person.last_milestone = {
            event: MILESTONE_APPLICANT_SUBMITTED,
        };
        const wrapper = shallow(<PersonRow {...defaultProps} />);

        expect(wrapper.text()).toContain('Status:Completed');
    });
    it('shows not started status', () => {
        defaultProps.role = ROLE_COAPPLICANT;
        defaultProps.person.last_milestone = null;
        const wrapper = shallow(<PersonRow {...defaultProps} />);

        expect(wrapper.text()).toContain('Status:Not Started');
    });
    it('shows in progress status', () => {
        defaultProps.role = ROLE_COAPPLICANT;
        defaultProps.person.last_milestone = {
            event: MILESTONE_RENTAL_PROFILE_COMPLETED,
        };
        const wrapper = shallow(<PersonRow {...defaultProps} />);

        expect(wrapper.text()).toContain('Status:In Progress');
    });
});
