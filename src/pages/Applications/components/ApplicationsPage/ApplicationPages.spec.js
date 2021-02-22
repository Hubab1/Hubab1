import React from 'react';
import { shallow } from 'enzyme';

import { ACTIVE_APPLICATION_STATUSES, PAST_APPLICATION_STATUSES, APPLICANT_ROLE_VALUES } from 'app/constants';
import * as hooks from 'hooks';
import ApplicationsPage from './ApplicationsPage';

const mockUseApplicationRoles = (returnValue = {}) => {
    return jest.spyOn(hooks, 'useApplicationRoles').mockReturnValue({
        loading: false,
        error: undefined,
        applicationRoles: [],
        ...returnValue,
    });
};

describe('ApplicationPage', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('useApplicationRoles error shows error notification', () => {
        mockUseApplicationRoles({ error: 'Woops' });
        const wrapper = shallow(<ApplicationsPage />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });

    it('useApplicationRoles success without application shows sections with empty copy', () => {
        mockUseApplicationRoles({ applicationRoles: [] });
        const wrapper = shallow(<ApplicationsPage />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });

    it('useApplicationRoles success with application shows active and past application sections', () => {
        const applicationRoles = [
            {
                application: { status: ACTIVE_APPLICATION_STATUSES[0] },
                role: APPLICANT_ROLE_VALUES.ROLE_PRIMARY_APPLICANT,
            },
            { application: { status: PAST_APPLICATION_STATUSES[0] }, role: APPLICANT_ROLE_VALUES.ROLE_CO_APPLICANT },
        ];
        mockUseApplicationRoles({ applicationRoles });
        const wrapper = shallow(<ApplicationsPage />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
