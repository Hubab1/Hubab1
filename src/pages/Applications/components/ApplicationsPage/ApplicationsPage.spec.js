import React from 'react';
import { shallow } from 'enzyme';
import moment from 'moment';

import { ACTIVE_APPLICATION_STATUSES, PAST_APPLICATION_STATUSES, APPLICANT_ROLE_VALUES } from 'app/constants';
import Page from 'components/common/Page/Page';
import ApplicationsPage from './ApplicationsPage';
import * as applicationPage from './ApplicationsPage';

const mockUseApplicationRoles = (returnValue = {}) => {
    return jest.spyOn(applicationPage, 'useApplications').mockReturnValue({
        loading: false,
        error: undefined,
        applications: [],
        ...returnValue,
    });
};

describe('ApplicationsPages', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('useApplications error shows error notification', () => {
        mockUseApplicationRoles({ error: 'Woops' });
        const wrapper = shallow(<ApplicationsPage />);
        expect(wrapper.find(Page).dive().getElement()).toMatchSnapshot();
    });

    it('useApplications loading shows empty page', () => {
        mockUseApplicationRoles({ loading: true });
        const wrapper = shallow(<ApplicationsPage />);
        expect(wrapper.find(Page).dive().getElement()).toMatchSnapshot();
    });

    it('useApplications success without application shows sections with empty copy', () => {
        mockUseApplicationRoles({ applications: [] });
        const wrapper = shallow(<ApplicationsPage />);
        expect(wrapper.find(Page).dive().getElement()).toMatchSnapshot();
    });

    it('useApplications success with application shows active and past application sections sorted by last activity', () => {
        const applications = [
            {
                id: '3rd-recent',
                status: ACTIVE_APPLICATION_STATUSES[0],
                role: APPLICANT_ROLE_VALUES.ROLE_PRIMARY_APPLICANT,
                lastActivity: moment('2020-01-01').format('MM-DD-YYYY'),
            },
            {
                id: '1st-recent',
                status: ACTIVE_APPLICATION_STATUSES[0],
                role: APPLICANT_ROLE_VALUES.ROLE_PRIMARY_APPLICANT,
                lastActivity: moment('2020-01-03').format('MM-DD-YYYY'),
            },
            {
                id: '2nd-recent',
                status: ACTIVE_APPLICATION_STATUSES[0],
                role: APPLICANT_ROLE_VALUES.ROLE_PRIMARY_APPLICANT,
                lastActivity: moment('2020-01-02').format('MM-DD-YYYY'),
            },
            {
                id: 'past-application',
                status: PAST_APPLICATION_STATUSES[0],
                role: APPLICANT_ROLE_VALUES.ROLE_CO_APPLICANT,
                lastActivity: moment('2020-01-01').format('MM-DD-YYYY'),
            },
        ];
        mockUseApplicationRoles({ applications });
        const wrapper = shallow(<ApplicationsPage />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
