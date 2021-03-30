import React from 'react';
import { shallow } from 'enzyme';

import {
    ACTIVE_APPLICATION_STATUSES,
    APPLICANT_ROLE_VALUES,
    APPLICATION_STATUSES,
    ROLE_CO_APPLICANT,
    ROUTES,
} from 'constants/constants';
import { Application } from './Application';
import ActionButton from 'common-components/ActionButton/ActionButton';
import API from 'api/api';

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

    it('renders application - all data present', () => {
        const wrapper = shallow(<Application application={application} isActive={true} />);
        const content = wrapper.find('[data-testid="content"]');
        const header = wrapper.find('[data-testid="header"]');

        expect(header.html().includes('Community Alpha, #12')).toBe(true);
        expect(content.html().includes('Move in Date: <span>01/01/2020</span>')).toBe(true);
        expect(content.html().includes('Lease Term: <span>12</span>')).toBe(true);
        expect(content.html().includes('Monthly Rent: <span>$1.500</span>')).toBe(true);
        expect(content.html().includes('Role: <span>Main Applicant</span>')).toBe(true);
        expect(content.html().includes('Application ID <span>1</span>')).toBe(true);
    });

    it('renders application content - missing data', () => {
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
        expect(content.html().includes('Application ID <span>1</span>')).toBe(true);
    });

    it('renders "open application" button if active app or past denied app', () => {
        let wrapper;

        wrapper = shallow(
            <Application
                application={{ ...application, status: APPLICATION_STATUSES.APPLICATION_STATUS_IN_PROGRESS }}
            />
        );
        expect(wrapper.find(ActionButton).length).toBe(1);

        wrapper = shallow(
            <Application application={{ ...application, status: APPLICATION_STATUSES.APPLICATION_STATUS_COMPLETED }} />
        );
        expect(wrapper.find(ActionButton).length).toBe(1);

        wrapper = shallow(
            <Application
                isActive={false}
                application={{ ...application, status: APPLICATION_STATUSES.APPLICATION_STATUS_DENIED }}
            />
        );
        expect(wrapper.find(ActionButton).length).toBe(1);

        wrapper = shallow(
            <Application
                isActive={false}
                application={{ ...application, status: APPLICATION_STATUSES.APPLICATION_STATUS_COMPLETED }}
            />
        );
        expect(wrapper.find(ActionButton).length).toBe(0);

        wrapper = shallow(
            <Application
                isActive={false}
                application={{ ...application, status: APPLICATION_STATUSES.APPLICATION_STATUS_CANCELLED }}
            />
        );
        expect(wrapper.find(ActionButton).length).toBe(0);
    });

    it('fetches an application when clicking on the button', async () => {
        const fetchRenterProfile = jest.fn();
        const wrapper = shallow(
            <Application
                application={{ ...application, status: APPLICATION_STATUSES.APPLICATION_STATUS_IN_PROGRESS }}
                fetchRenterProfile={fetchRenterProfile}
                initnialPage={ROUTES.FEES_AND_DEPOSITS}
            />
        );
        await wrapper.find(ActionButton).simulate('click');
        expect(fetchRenterProfile).toBeCalledWith(application.id);
    });

    describe('invitation', () => {
        const invitee = {
            id: 123,
            role: 30,
        };

        const fetchRenterProfile = jest.fn().mockReturnValue(Promise.resolve());
        let wrapper;

        beforeEach(() => {
            wrapper = shallow(
                <Application
                    application={{ ...application }}
                    invitee={invitee}
                    fetchRenterProfile={fetchRenterProfile}
                />
            );
        });

        afterEach(() => {
            jest.restoreAllMocks();
        });

        it('renders invitations correctly', async () => {
            expect(wrapper.getElement()).toMatchSnapshot();
        });

        it('handles "Start Application" button correctly', async () => {
            jest.spyOn(API, 'createApplicantRole').mockReturnValue({});
            await wrapper.find(ActionButton).simulate('click');
            expect(API.createApplicantRole).toBeCalledWith(invitee.id);
            expect(fetchRenterProfile).toBeCalledWith(application.id);
        });
    });
});
