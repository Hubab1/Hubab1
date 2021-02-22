import React from 'react';
import { shallow } from 'enzyme';

import { ACTIVE_APPLICATION_STATUSES, PAST_APPLICATION_STATUSES, APPLICANT_ROLE_VALUES } from 'app/constants';
import * as hooks from 'hooks';
import Page from 'components/common/Page/Page';
import ApplicationsPage from './ApplicationsPage';

const mockUseApplicationRoles = (returnValue = {}) => {
    return jest.spyOn(hooks, 'useApplications').mockReturnValue({
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

    it('useApplications success with application shows active and past application sections', () => {
        const applications = [
            { status: ACTIVE_APPLICATION_STATUSES[0], role: APPLICANT_ROLE_VALUES.ROLE_PRIMARY_APPLICANT },
            { status: PAST_APPLICATION_STATUSES[0], role: APPLICANT_ROLE_VALUES.ROLE_CO_APPLICANT },
        ];
        mockUseApplicationRoles({ applications });
        const wrapper = shallow(<ApplicationsPage />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
