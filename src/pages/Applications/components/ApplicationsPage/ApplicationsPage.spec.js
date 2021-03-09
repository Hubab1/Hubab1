import React from 'react';
import { shallow } from 'enzyme';
import moment from 'moment';

import { ACTIVE_APPLICATION_STATUSES, PAST_APPLICATION_STATUSES, APPLICANT_ROLE_VALUES } from 'app/constants';
import * as hooks from '../../hooks';
import ApplicationsPage from './ApplicationsPage';
import Application from '../Application/Application';

// Mock hooks, issue: https://stackoverflow.com/questions/53162001/typeerror-during-jests-spyon-cannot-set-property-getrequest-of-object-which
jest.mock('../../hooks', () => ({
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
    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('useApplications error shows error notification', () => {
        mockUseApplications({ error: 'Woops', loading: true });
        const wrapper = shallow(<ApplicationsPage />);

        expect(wrapper.html().includes('My Applications')).toBe(true);
        expect(wrapper.html().includes('Woops')).toBe(true);
        expect(wrapper.html().includes('Active Applications')).toBe(false);
        expect(wrapper.html().includes('Past Applications')).toBe(false);
    });

    it('useApplications loading shows empty page', () => {
        mockUseApplications({ loading: true });
        const wrapper = shallow(<ApplicationsPage />);

        expect(wrapper.html().includes('My Applications')).toBe(true);
        expect(wrapper.html().includes('Active Applications')).toBe(false);
        expect(wrapper.html().includes('Past Applications')).toBe(false);
    });

    it('useApplications success without application shows sections with empty copy', () => {
        mockUseApplications({ applications: [] });
        const wrapper = shallow(<ApplicationsPage />);

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
        const wrapper = shallow(<ApplicationsPage />);
        const activeApplications = wrapper.find('[data-testid="active-applications"]').find(Application);
        const pastApplications = wrapper.find('[data-testid="past-applications"]').find(Application);

        expect(activeApplications.length).toBe(1);
        expect(pastApplications.length).toBe(1);
    });
});
