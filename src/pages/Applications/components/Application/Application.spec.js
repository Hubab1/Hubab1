import React from 'react';
import { shallow } from 'enzyme';

import { ACTIVE_APPLICATION_STATUSES, PAST_APPLICATION_STATUSES, APPLICANT_ROLE_VALUES } from 'app/constants';
import Application from './Application';

// TODO backfill tests with direct asserts | created by: @JimVercoelen | ticket: https://nestiolistings.atlassian.net/browse/NESTIO-20450
describe('Application - active / past applications match snapshots', () => {
    it('renders active application', () => {
        const application = {
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

        const wrapper = shallow(<Application application={application} isActive />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });

    it('renders active application without required application data', () => {
        const application = {
            id: 1,
            status: ACTIVE_APPLICATION_STATUSES[0],
            lease_term: 12,
            role: APPLICANT_ROLE_VALUES.ROLE_PRIMARY_APPLICANT,
            community: {
                display_name: 'Community Alpha',
            },
        };

        const wrapper = shallow(<Application application={application} isActive />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });

    it('renders past application', () => {
        const application = {
            id: 1,
            status: PAST_APPLICATION_STATUSES[0],
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

        const wrapper = shallow(<Application application={application} isActive={false} />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
