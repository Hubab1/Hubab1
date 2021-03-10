import React from 'react';
import { shallow } from 'enzyme';

import {
    ACTIVE_APPLICATION_STATUSES,
    PAST_APPLICATION_STATUSES,
    APPLICANT_ROLE_VALUES,
    APPLICATION_STATUSES,
} from 'app/constants';
import Application from './Application';

describe('Application', () => {
    let application = {};
    beforeEach(() => {
        application = {
            id: 1,
            status: ACTIVE_APPLICATION_STATUSES[0],
            lease_start_date: new Date('01-01-2020').toISOString(),
            lease_term: 12,
            fees_breakdown: {
                monthly_fees: {
                    total: '1.500',
                },
            },
            role: APPLICANT_ROLE_VALUES.ROLE_PRIMARY_APPLICANT,
            unit: {
                unit_number: '12',
            },
            community: {
                display_name: 'Community Alpha',
            },
        };
    });

    it('renders application statuses and colors', () => {
        let wrapper;

        // Black statusses
        wrapper = shallow(
            <Application
                application={{ ...application, status: APPLICATION_STATUSES.APPLICATION_STATUS_IN_PROGRESS }}
            />
        );
        expect(wrapper.html().includes('<span style="color:#000">In Progress</span>')).toBe(true);

        wrapper = shallow(
            <Application application={{ ...application, status: APPLICATION_STATUSES.APPLICATION_STATUS_SUBMITTED }} />
        );
        expect(wrapper.html().includes('<span style="color:#000">Submitted</span>')).toBe(true);

        wrapper = shallow(
            <Application application={{ ...application, status: APPLICATION_STATUSES.APPLICATION_STATUS_COMPLETED }} />
        );
        expect(wrapper.html().includes('<span style="color:#000">Completed</span>')).toBe(true);

        // Green statusses
        wrapper = shallow(
            <Application application={{ ...application, status: APPLICATION_STATUSES.APPLICATION_STATUS_APPROVED }} />
        );
        expect(wrapper.html().includes('<span style="color:#67C18B">Approved</span>')).toBe(true);

        // Yellow statusses
        wrapper = shallow(
            <Application
                application={{ ...application, status: APPLICATION_STATUSES.APPLICATION_STATUS_CONDITIONALLY_APPROVED }}
            />
        );
        expect(wrapper.html().includes('<span style="color:#FAC700">Conditionally Approved</span>')).toBe(true);

        // Red statusses
        wrapper = shallow(
            <Application application={{ ...application, status: APPLICATION_STATUSES.APPLICATION_STATUS_DENIED }} />
        );
        expect(wrapper.html().includes('<span style="color:#FB6D68">Denied</span>')).toBe(true);

        wrapper = shallow(
            <Application application={{ ...application, status: APPLICATION_STATUSES.APPLICATION_STATUS_CANCELLED }} />
        );
        expect(wrapper.html().includes('<span style="color:#FB6D68">Cancelled</span>')).toBe(true);
    });

    it('renders applicant roles', () => {
        let wrapper;

        wrapper = shallow(
            <Application application={{ ...application, role: APPLICANT_ROLE_VALUES.ROLE_PRIMARY_APPLICANT }} />
        );
        expect(wrapper.html().includes('Main Applicant')).toBe(true);

        wrapper = shallow(
            <Application application={{ ...application, role: APPLICANT_ROLE_VALUES.ROLE_CO_APPLICANT }} />
        );
        expect(wrapper.html().includes('Roommate')).toBe(true);

        wrapper = shallow(<Application application={{ ...application, role: APPLICANT_ROLE_VALUES.ROLE_GUARANTOR }} />);
        expect(wrapper.html().includes('Guarantor')).toBe(true);

        wrapper = shallow(<Application application={{ ...application, role: APPLICANT_ROLE_VALUES.ROLE_OCCUPANT }} />);
        expect(wrapper.html().includes('Occupant')).toBe(true);
    });

    it('renders active application - all data present', () => {
        const wrapper = shallow(<Application application={application} isActive={true} />);
        const content = wrapper.find('[data-testid="content"]');
        const header = wrapper.find('[data-testid="header"]');

        expect(header.html().includes('Community Alpha, #12')).toBe(true);
        expect(content.html().includes('Move in Date: <span>01/01/2020</span>')).toBe(true);
        expect(content.html().includes('Lease Term: <span>12</span>')).toBe(true);
        expect(content.html().includes('Monthly Rent: <span>$1.500</span>')).toBe(true);
        expect(content.html().includes('Role: <span>Main Applicant</span>')).toBe(true);
        expect(content.html().includes('Application ID: <span>1</span>')).toBe(true);
    });

    it('renders active application content - missing data', () => {
        application = {
            ...application,
            unit: undefined,
            lease_start_date: undefined,
            lease_term: undefined,
            fees_breakdown: undefined,
        };

        const wrapper = shallow(<Application application={application} isActive={true} />);
        const content = wrapper.find('[data-testid="content"]');
        const header = wrapper.find('[data-testid="header"]');

        expect(header.html().includes('Community Alpha')).toBe(true);
        expect(content.html().includes('Move in Date: <span>-</span>')).toBe(true);
        expect(content.html().includes('Lease Term: <span>-</span>')).toBe(true);
        expect(content.html().includes('Monthly Rent: <span>-</span>')).toBe(true);
        expect(content.html().includes('Role: <span>Main Applicant</span>')).toBe(true);
        expect(content.html().includes('Application ID: <span>1</span>')).toBe(true);
    });

    it('renders past application', () => {
        const wrapper = shallow(<Application application={application} isActive={false} />);
        const content = wrapper.find('[data-testid="content"]');
        const header = wrapper.find('[data-testid="header"]');

        expect(header.length).toBe(1);
        expect(content.length).toBe(0);
    });
});
