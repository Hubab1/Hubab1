import React from 'react';
import { shallow } from 'enzyme';

import { MILESTONE_LEASE_SENT } from 'constants/constants';
import { ApplicationCancelledPage } from './ApplicationCancelledPage';

const buildProps = (buildingName = 'Fake Building', streetAddress = '123 Fake Street', unitNumber = '2B') => {
    return {
        profile: {
            events: [{ event: MILESTONE_LEASE_SENT.toString() }],
            unit: {
                unit_number: unitNumber,
            },
        },
        configuration: {
            community: {
                building_name: buildingName,
                normalized_street_address: streetAddress,
                contact_phone: '1234445510',
            },
        },
    };
};

it('matches snapshot', () => {
    const wrapper = shallow(<ApplicationCancelledPage {...buildProps()} />);
    expect(wrapper.getElement()).toMatchSnapshot();
});

it('matches snapshot when no unit', () => {
    const wrapper = shallow(<ApplicationCancelledPage {...buildProps()} profile={{ unit: null }} />);
    expect(wrapper.getElement()).toMatchSnapshot();
});
