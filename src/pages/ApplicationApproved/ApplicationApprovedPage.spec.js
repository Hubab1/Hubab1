import React from 'react';
import { shallow } from 'enzyme';

import { MILESTONE_LEASE_SENT } from 'constants/constants';

import ActionButton from 'common-components/ActionButton/ActionButton';

import { ApplicationApprovedPage } from './ApplicationApprovedPage';
import { ApplicationApprovedView } from 'pages/ApplicationApproved/components/ApplicationApprovedView';
import { SignLeaseView } from 'pages/ApplicationApproved/components/SignLeaseView';
import { PaymentDetailsCard } from 'common-components/PaymentDetails/PaymentDetailsCard/PaymentDetailsCard';
import { LinkButton } from 'assets/styles';

const buildProps = (buildingName = 'Fake Building', streetAddress = '123 Fake Street', unitNumber = '2B') => {
    return {
        profile: {
            events: [{ event: MILESTONE_LEASE_SENT.toString() }],
            unit: {
                unit_number: unitNumber,
            },
            last_status_change: {
                created_at: '2020-05-06 04:06:23',
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
        applicant: {
            person: {
                name: 'John Doe',
            },
        },
        applicantUpdated: jest.fn(),
        fetchPayments: jest.fn(),
        payables: [],
        applicationFees: {},
        leaseSettingsId: '20'
    };
};

describe('it displays the right section', () => {
    const props = buildProps('Fake Building', '123 Fake Street', null);
    const wrapper = shallow(<ApplicationApprovedPage {...props} />);

    it('shows payment details section when clicking continue', () => {
        expect(wrapper.find(ApplicationApprovedView)).toHaveLength(1);
        wrapper.dive().find(ActionButton).simulate('click');
        expect(wrapper.find(PaymentDetailsCard)).toBeTruthy();
        expect(wrapper.getElement()).toMatchSnapshot();
    });

    it('hides payment details section when clicking back', () => {
        expect(wrapper.find(SignLeaseView)).toHaveLength(1);
        wrapper.dive().find(LinkButton).simulate('click');
        expect(wrapper.find(PaymentDetailsCard)).toHaveLength(0);
        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
