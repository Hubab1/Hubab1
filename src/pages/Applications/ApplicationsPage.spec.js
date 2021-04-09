import React from 'react';
import { shallow, render } from 'enzyme';
import moment from 'moment';

import { ACTIVE_APPLICATION_STATUSES, PAST_APPLICATION_STATUSES, APPLICANT_ROLE_VALUES } from 'constants/constants';
import Page from 'common-components/Page/Page';
import * as hooks from './hooks';
import { ApplicationsPage, getAlreadyHasActiveApplicationForCommuntiyAsPrimaryError } from './ApplicationsPage';
import Application from './components/Application';

// Mock hooks, issue: https://stackoverflow.com/questions/53162001/typeerror-during-jests-spyon-cannot-set-property-getrequest-of-object-which
jest.mock('./hooks', () => ({
    useApplications: jest.fn(),
}));

const mockUseApplications = (returnValue = {}) => {
    return jest.spyOn(hooks, 'useApplications').mockReturnValue({
        loading: false,
        error: undefined,
        applications: [],
        ...returnValue,
    });
};

describe('ApplicationsPage', () => {
    let props = {};
    beforeEach(() => {
        props = {
            applicant: { id: 1 },
            community: null,
            unit: null,
            accessedAppByInvitationOrWebsite: false,
        };
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('useApplications error shows error notification', () => {
        mockUseApplications({ error: 'Woops', loading: true });
        const wrapper = shallow(<ApplicationsPage {...props} />);

        expect(wrapper.html().includes('My Applications')).toBe(true);
        expect(wrapper.html().includes('Woops')).toBe(true);
        expect(wrapper.html().includes('Active Applications')).toBe(false);
        expect(wrapper.html().includes('Past Applications')).toBe(false);
    });

    it('useApplications loading shows empty page', () => {
        mockUseApplications({ loading: true });
        const wrapper = shallow(<ApplicationsPage {...props} />);

        expect(wrapper.html().includes('My Applications')).toBe(true);
        expect(wrapper.html().includes('Active Applications')).toBe(false);
        expect(wrapper.html().includes('Past Applications')).toBe(false);
    });

    it('useApplications success without application shows sections with empty copy', () => {
        mockUseApplications({ applications: [] });
        const wrapper = shallow(<ApplicationsPage {...props} />);

        expect(wrapper.html().includes('My Applications')).toBe(true);
        expect(wrapper.html().includes('Active Applications')).toBe(true);
        expect(wrapper.html().includes('You don&#x27;t have any active applications.')).toBe(true);
        expect(wrapper.html().includes('Past Applications')).toBe(true);
        expect(wrapper.html().includes('You don&#x27;t have any past applications.')).toBe(true);
    });

    it('useApplications success with application shows active and past application sections', () => {
        const applications = [
            {
                id: 'active-application',
                status: ACTIVE_APPLICATION_STATUSES[0],
                role: APPLICANT_ROLE_VALUES.ROLE_PRIMARY_APPLICANT,
                community: { display_name: 'community' },
                lastActivity: moment('2020-01-02').format('MM-DD-YYYY'),
            },
            {
                id: 'past-application',
                status: PAST_APPLICATION_STATUSES[0],
                role: APPLICANT_ROLE_VALUES.ROLE_CO_APPLICANT,
                community: { display_name: 'community' },
                lastActivity: moment('2020-01-01').format('MM-DD-YYYY'),
            },
        ];
        mockUseApplications({ applications });
        const wrapper = shallow(<ApplicationsPage {...props} />);
        const activeApplications = wrapper.find('[data-testid="active-applications"]').find(Application);
        const pastApplications = wrapper.find('[data-testid="past-applications"]').find(Application);

        expect(activeApplications.length).toBe(1);
        expect(pastApplications.length).toBe(1);
    });

    it('show already has active application for community as primary applicant', () => {
        props = {
            applicant: { id: 1 },
            community: { id: 1, display_name: 'Community Name', contact_phone: '(858) 485-9199' },
            unit: { id: 1, unit_number: '207' },
            accessedAppByInvitationOrWebsite: true,
        };

        const applications = [
            {
                id: 1,
                status: ACTIVE_APPLICATION_STATUSES[0],
                role: APPLICANT_ROLE_VALUES.ROLE_PRIMARY_APPLICANT,
                primary_applicant: props.applicant,
                community: props.community,
                lastActivity: moment('2020-01-02').format('MM-DD-YYYY'),
            },
        ];
        mockUseApplications({ applications });

        const wrapper = shallow(<ApplicationsPage {...props} />);
        const page = wrapper.find(Page);
        const renderedError = render(page.prop('notification').messages).html();

        expect(renderedError).toEqual(
            'Oops, it looks like you already have an active application for Community Name. ' +
            'Please continue your application for unit 207, or call our office at (858) 485-9199 ' +
            'if you would like to start another application at Community Name.'
        );
    });
});
