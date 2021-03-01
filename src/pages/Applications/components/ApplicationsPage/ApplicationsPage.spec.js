import React from 'react';
import { shallow } from 'enzyme';
import moment from 'moment';

import { ACTIVE_APPLICATION_STATUSES, PAST_APPLICATION_STATUSES, APPLICANT_ROLE_VALUES } from 'app/constants';
import * as hooks from '../../hooks';
import Page from 'components/common/Page/Page';
import ApplicationsPage from './ApplicationsPage';

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

// TODO backfill tests with direct asserts | created by: @JimVercoelen | ticket: https://nestiolistings.atlassian.net/browse/NESTIO-20450
describe('ApplicationsPages - match snapshots', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('useApplications error shows error notification', () => {
        mockUseApplications({ error: 'Woops', loading: true });
        const wrapper = shallow(<ApplicationsPage />);
        expect(wrapper.find(Page).dive().getElement()).toMatchSnapshot();
    });

    it('useApplications loading shows empty page', () => {
        mockUseApplications({ loading: true });
        const wrapper = shallow(<ApplicationsPage />);
        expect(wrapper.find(Page).dive().getElement()).toMatchSnapshot();
    });

    it('useApplications success without application shows sections with empty copy', () => {
        mockUseApplications({ applications: [] });
        const wrapper = shallow(<ApplicationsPage />);
        expect(wrapper.find(Page).dive().getElement()).toMatchSnapshot();
    });

    it('useApplications success with application shows active and past application sections', () => {
        const applications = [
            {
                id: 'active-application',
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
        mockUseApplications({ applications });
        const wrapper = shallow(<ApplicationsPage />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
