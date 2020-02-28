import React from 'react';
import { shallow } from 'enzyme';
import { AppApproved } from './AppApproved';

import { LeaseTermsPage } from './LeaseTermsPage';
import { ROLE_PRIMARY_APPLICANT } from 'app/constants';


const buildProps = (buildingName = 'Fake Building', streetAddress = '123 Fake Street', unitNumber = '2B') => {
    return {
        profile: {
            unit: {
                unit_number: unitNumber,
            },
        },
        configuration: {
            community: {
                building_name: buildingName,
                normalized_street_address: streetAddress,
            }
        },
    }
};

describe('application unit', () => {
    it('displays building name when no unit', () => {
        const props = buildProps('Fake Building', '123 Fake Street', null);
        props.unit = null;

        const wrapper = shallow(<AppApproved {...props} />);

        expect(wrapper.find('#application-unit').text()).toEqual('Fake Building')
    });

    it('displays building name without unit when no unit number', () => {
        const props = buildProps('Fake Building', '123 Fake Street', null);

        const wrapper = shallow(<AppApproved {...props} />);

        expect(wrapper.find('#application-unit').text()).toEqual('Fake Building')
    });

    it('displays building name with unit when has unit number', () => {
        const props = buildProps('Fake Building', '123 Fake Street', '7F');

        const wrapper = shallow(<AppApproved {...props} />);

        expect(wrapper.find('#application-unit').text()).toEqual('Fake Building Unit 7F')
    });

    it('displays normalized street address and unit number when no building name', () => {
        const props = buildProps(null, '123 Fake Street', '7F');

        const wrapper = shallow(<AppApproved {...props} />);

        expect(wrapper.find('#application-unit').text()).toEqual('123 Fake Street Unit 7F')
    });
});

describe('security deposit message', () => {
    it('should render when there is a security deposit', () => {
        const props = buildProps();
        props.profile.security_deposit = 123.45;
        props.profile.security_deposit_multiplier = 1.5;

        const wrapper = shallow(<AppApproved {...props} />);

        expect(wrapper.find('.security-deposit-container')).toHaveLength(1);
    });

    it('should not render when there is no security deposit', () => {
        const props = buildProps();
        props.profile.security_deposit = null;
        props.profile.security_deposit_multiplier = null;

        const wrapper = shallow(<AppApproved {...props} />);

        expect(wrapper.find('.security-deposit-container')).toHaveLength(0);
    });
});
