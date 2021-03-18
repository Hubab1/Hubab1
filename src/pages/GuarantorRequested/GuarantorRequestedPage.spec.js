import React from 'react';
import { shallow, mount } from 'enzyme';

import { ROLE_PRIMARY_APPLICANT, MILESTONE_REQUEST_GUARANTOR, ROUTES } from 'constants/constants';
import { GuarantorRequestedPage } from './GuarantorRequestedPage';
import ActionButton from 'common-components/ActionButton/ActionButton';
import { AdverseActionNoticeButton } from 'common-components/AdverseActionNoticeButton/AdverseActionNoticeButton';

const buildProps = (
    buildingName = 'Fake Building',
    streetAddress = '123 Fake Street',
    unitNumber = '2B',
    applicant = {
        person: {
            name: 'John Doe',
        },
    }
) => {
    return {
        profile: {
            events: [{ event: MILESTONE_REQUEST_GUARANTOR }],
            unit: {
                unit_number: unitNumber,
            },
            last_status_change: {
                created_at: '2020-05-06 04:06:23',
            },
            primary_applicant: {
                first_name: 'John',
                last_name: 'Doe',
            },
        },
        configuration: {
            community: {
                building_name: buildingName,
                normalized_street_address: streetAddress,
            },
        },
        history: {
            push: jest.fn(),
        },
        applicant: applicant,
        applicantUpdated: jest.fn(),
    };
};

it('Matches snapshot', () => {
    const wrapper = shallow(<GuarantorRequestedPage {...buildProps()} />);
    expect(wrapper.getElement()).toMatchSnapshot();
});

it('Case Co-applicant', () => {
    const wrapper = mount(<GuarantorRequestedPage {...buildProps()} />);
    expect(wrapper.find(AdverseActionNoticeButton)).toHaveLength(1);
});

it('Primary Applicant', () => {
    const primaryApplicant = {
        person: {
            name: 'John Doe',
        },
        role: ROLE_PRIMARY_APPLICANT,
    };

    const defaultProps = {
        ...buildProps(),
        history: {
            push: jest.fn(),
        },
        initialPage: '/guarantor_request',
    };

    const wrapper = shallow(
        <GuarantorRequestedPage {...defaultProps} applicant={primaryApplicant} isPrimaryApplicant={true} />
    );
    expect(wrapper.find(ActionButton)).toHaveLength(1);
    wrapper.find(ActionButton).at(0).simulate('click');
    expect(defaultProps.history.push).toHaveBeenCalledWith(ROUTES.GUARANTOR);
});
