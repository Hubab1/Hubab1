import { shallow } from 'enzyme';
import { AppApprovedContainer } from 'components/app-approved/AppApprovedContainer';
import ActionButton from 'components/common/ActionButton/ActionButton';
import { PaymentDetailsCard } from 'components/payment-details/PaymentDetailsCard';
import React from 'react';
import { AppApprovedView } from 'components/app-approved/AppApprovedView';
import { SignLeaseView } from 'components/app-approved/SignLeaseView';
import { LinkButton } from 'assets/styles';

const buildProps = (buildingName = 'Fake Building', streetAddress = '123 Fake Street', unitNumber = '2B') => {
    return {
        profile: {
            events: [{ event: '270' }],
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
            client: {
                person: {
                    name: 'John Doe',
                },
            },
        },
        applicantUpdated: jest.fn(),
        fetchPayments: jest.fn(),
        payables: [],
    };
};

describe('it displays the right section', () => {
    const props = buildProps('Fake Building', '123 Fake Street', null);
    const wrapper = shallow(<AppApprovedContainer {...props} />);

    it('shows payment details section when clicking continue', () => {
        expect(wrapper.find(AppApprovedView)).toHaveLength(1);
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
