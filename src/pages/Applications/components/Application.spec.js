import React from 'react';
import { shallow } from 'enzyme';

import API from 'api/api';
import {
    ACTIVE_APPLICATION_STATUSES,
    APPLICANT_ROLE_VALUES,
    APPLICATION_STATUSES,
    ROUTES,
} from 'constants/constants';
import { Application } from './Application';
import ActionButton from 'common-components/ActionButton/ActionButton';

const mockCreateApplicantRole = (returnValue = Promise.resolve({})) => {
    return jest.spyOn(API, 'createApplicantRole').mockReturnValue(returnValue);
};

const defaultApplication = {
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

const defaultProps = {
    invitee: null,
    history: {},
    toggleLoader: jest.fn(),
    fetchRenterProfile: jest.fn().mockReturnValue(Promise.resolve()),
    setError: jest.fn(),
};

describe('Application', () => {
    let application = {};
    let props = {};

    beforeEach(() => {
        application = defaultApplication;

        props = defaultProps;
    });

    it('renders application statuses and colors', () => {
        let wrapper;

        // Black statusses
        wrapper = shallow(
            <Application
                application={{ ...application, status: APPLICATION_STATUSES.APPLICATION_STATUS_IN_PROGRESS }}
                {...props}
            />
        );
        expect(wrapper.html().includes('<span style="color:#000">In Progress</span>')).toBe(true);

        wrapper = shallow(
            <Application application={{ ...application, status: APPLICATION_STATUSES.APPLICATION_STATUS_SUBMITTED }} {...props} />
        );
        expect(wrapper.html().includes('<span style="color:#000">Submitted</span>')).toBe(true);

        wrapper = shallow(
            <Application application={{ ...application, status: APPLICATION_STATUSES.APPLICATION_STATUS_COMPLETED }} {...props} />
        );
        expect(wrapper.html().includes('<span style="color:#000">Completed</span>')).toBe(true);

        // Green statusses
        wrapper = shallow(
            <Application application={{ ...application, status: APPLICATION_STATUSES.APPLICATION_STATUS_APPROVED }} {...props} />
        );
        expect(wrapper.html().includes('<span style="color:#67C18B">Approved</span>')).toBe(true);

        // Yellow statusses
        wrapper = shallow(
            <Application
                application={{ ...application, status: APPLICATION_STATUSES.APPLICATION_STATUS_CONDITIONALLY_APPROVED }}
                {...props}
            />
        );
        expect(wrapper.html().includes('<span style="color:#FAC700">Conditionally Approved</span>')).toBe(true);

        // Red statusses
        wrapper = shallow(
            <Application application={{ ...application, status: APPLICATION_STATUSES.APPLICATION_STATUS_DENIED }} {...props} />
        );
        expect(wrapper.html().includes('<span style="color:#FB6D68">Denied</span>')).toBe(true);

        wrapper = shallow(
            <Application application={{ ...application, status: APPLICATION_STATUSES.APPLICATION_STATUS_CANCELLED }} {...props} />
        );
        expect(wrapper.html().includes('<span style="color:#FB6D68">Cancelled</span>')).toBe(true);
    });

    it('renders applicant roles', () => {
        let wrapper;

        wrapper = shallow(
            <Application application={{ ...application, role: APPLICANT_ROLE_VALUES.ROLE_PRIMARY_APPLICANT }} {...props} />
        );
        expect(wrapper.html().includes('Main Applicant')).toBe(true);

        wrapper = shallow(
            <Application application={{ ...application, role: APPLICANT_ROLE_VALUES.ROLE_CO_APPLICANT }} {...props} />
        );
        expect(wrapper.html().includes('Roommate')).toBe(true);

        wrapper = shallow(<Application application={{ ...application, role: APPLICANT_ROLE_VALUES.ROLE_GUARANTOR }} {...props} />);
        expect(wrapper.html().includes('Guarantor')).toBe(true);

        wrapper = shallow(<Application application={{ ...application, role: APPLICANT_ROLE_VALUES.ROLE_OCCUPANT }} {...props} />);
        expect(wrapper.html().includes('Occupant')).toBe(true);
    });

    it('renders application - all data present', () => {
        const wrapper = shallow(<Application application={application} {...props} isActive={true} />);
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

        const wrapper = shallow(<Application application={application} {...props} isActive={true} />);
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
                {...props}
            />
        );
        expect(wrapper.find(ActionButton).length).toBe(1);

        wrapper = shallow(
            <Application application={{ ...application, status: APPLICATION_STATUSES.APPLICATION_STATUS_COMPLETED }} {...props} />
        );
        expect(wrapper.find(ActionButton).length).toBe(1);

        wrapper = shallow(
            <Application
                application={{ ...application, status: APPLICATION_STATUSES.APPLICATION_STATUS_DENIED }}
                {...props}
                isActive={false}
            />
        );
        expect(wrapper.find(ActionButton).length).toBe(1);

        wrapper = shallow(
            <Application
                application={{ ...application, status: APPLICATION_STATUSES.APPLICATION_STATUS_COMPLETED }}
                {...props}
                isActive={false}
            />
        );
        expect(wrapper.find(ActionButton).length).toBe(0);

        wrapper = shallow(
            <Application
                application={{ ...application, status: APPLICATION_STATUSES.APPLICATION_STATUS_CANCELLED }}
                {...props}
                isActive={false}
            />
        );
        expect(wrapper.find(ActionButton).length).toBe(0);
    });

    it('fetches an application when clicking on the button', async () => {
        const fetchRenterProfile = jest.fn();
        const wrapper = shallow(
            <Application
                {...props}
                application={{ ...application, status: APPLICATION_STATUSES.APPLICATION_STATUS_IN_PROGRESS }}
                fetchRenterProfile={fetchRenterProfile}
                initialPage={ROUTES.FEES_AND_DEPOSITS}
            />
        );
        await wrapper.find(ActionButton).simulate('click');
        expect(fetchRenterProfile).toBeCalledWith(application.id);
    });
});

// TODO: remove only
describe.only('Application - invitation start application', () => {
    let wrapper;
    let application = {};
    let props = {};
    const invitee = {
        id: 123,
        role: 30,
    };

    beforeEach(() => {
        application = defaultApplication;

        props = defaultProps;

        wrapper = shallow(
            <Application
                {...props}
                application={{ ...application }}
                invitee={invitee}
            />
        );
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('renders correct CTA button', () => {
        const CTAButton = wrapper.find(ActionButton);
        expect(CTAButton.prop('variant')).toBe('contained');
        expect(CTAButton.prop('children')).toBe('Start Application');
    });

    it('handles successful attempt to start application', async () => {
        const createApplicantRole = mockCreateApplicantRole(Promise.resolve({}));
        const CTAButton = wrapper.find(ActionButton);
        const CTAButtonClickHandler = CTAButton.prop('onClick');

        await CTAButtonClickHandler();

        expect(props.toggleLoader).toBeCalledWith(true);
        expect(createApplicantRole).toBeCalledWith(invitee.id);
        expect(props.fetchRenterProfile).toBeCalledWith(application.id);
        expect(props.toggleLoader).toBeCalledWith(false);
    });

    it('handles failed attempt to start application', async () => {
        const createApplicantRole = mockCreateApplicantRole(Promise.reject({}));
        const CTAButton = wrapper.find(ActionButton);
        const CTAButtonClickHandler = CTAButton.prop('onClick');

        await CTAButtonClickHandler();

        expect(props.toggleLoader).toBeCalledWith(true);
        expect(createApplicantRole).toBeCalledWith(invitee.id);
        expect(props.fetchRenterProfile).toBeCalledWith(application.id);
        expect(props.toggleLoader).toBeCalledWith(false);
    });
});
