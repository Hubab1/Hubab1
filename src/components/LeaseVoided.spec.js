import React from 'react';
import { shallow } from 'enzyme';
import { LeaseVoided } from './LeaseVoided';
import { APPLICATION_EVENTS } from 'app/constants';


const buildProps = (buildingName = 'Fake Building', streetAddress = '123 Fake Street', unitNumber = '2B') => {
    return {
        profile: {
            events: [APPLICATION_EVENTS.MILESTONE_LEASE_VOIDED],
            unit: {
                unit_number: unitNumber,
            },
        },
        configuration: {
            community: {
                building_name: buildingName,
                normalized_street_address: streetAddress,
                contact_phone: '1234445510'
            }
        },
    }
};

it('matches snapshot', () => {
    const wrapper = shallow(<LeaseVoided {...buildProps()}/>);
    expect(wrapper.getElement()).toMatchSnapshot();
});

describe('application unit', () => {
    it('displays building name when no unit', () => {
        const props = buildProps('Fake Building', '123 Fake Street', null);
        props.unit = null;

        const wrapper = shallow(<LeaseVoided {...props} />);

        expect(wrapper.find('#application-unit').text()).toEqual('Fake Building')
    });

    it('displays building name without unit when no unit number', () => {
        const props = buildProps('Fake Building', '123 Fake Street', null);

        const wrapper = shallow(<LeaseVoided {...props} />);

        expect(wrapper.find('#application-unit').text()).toEqual('Fake Building')
    });

    it('displays building name with unit when has unit number', () => {
        const props = buildProps('Fake Building', '123 Fake Street', '7F');

        const wrapper = shallow(<LeaseVoided {...props} />);

        expect(wrapper.find('#application-unit').text()).toEqual('Fake Building Unit 7F')
    });

    it('displays normalized street address and unit number when no building name', () => {
        const props = buildProps(null, '123 Fake Street', '7F');

        const wrapper = shallow(<LeaseVoided {...props} />);

        expect(wrapper.find('#application-unit').text()).toEqual('123 Fake Street Unit 7F')
    });
});
