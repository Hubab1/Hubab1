import React from 'react';
import { shallow } from 'enzyme';
import { AppApproved } from './AppApproved';

import { LeaseTermsPage } from './LeaseTermsPage';
import { ROLE_PRIMARY_APPLICANT } from 'app/constants';


const buildProps = (buildingName, streetAddress, unitNumber) => {
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
