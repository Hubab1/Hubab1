import React from 'react';
import { shallow } from 'enzyme';
import { AppDenied } from './AppDenied';
import ActionButton from 'components/common/ActionButton/ActionButton';
import API from 'app/api';
import DenialReason from 'components/AppDenialReason';


const buildProps = (buildingName = 'Fake Building', streetAddress = '123 Fake Street', unitNumber = '2B') => {
    return {
        profile: {
            events: [{event: '270'}],
            unit: {
                unit_number: unitNumber,
            },
            last_status_change: {
                created_at: '2020-05-06 04:06:23'
            }
        },
        applicant: {
            client: {
                person: {
                    name: 'John Doe'
                },
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

it('matches snapshot', () => {
    const wrapper = shallow(<AppDenied {...buildProps()}/>);
    expect(wrapper.getElement()).toMatchSnapshot();
});

describe('application unit', () => {
    it('displays building name when no unit', () => {
        const props = buildProps('Fake Building', '123 Fake Street', null);
        props.unit = null;

        const wrapper = shallow(<AppDenied {...props} />);

        expect(wrapper.find('#application-unit').text()).toEqual('Fake Building')
    });

    it('displays building name without unit when no unit number', () => {
        const props = buildProps('Fake Building', '123 Fake Street', null);

        const wrapper = shallow(<AppDenied {...props} />);

        expect(wrapper.find('#application-unit').text()).toEqual('Fake Building')
    });

    it('displays building name with unit when has unit number', () => {
        const props = buildProps('Fake Building', '123 Fake Street', '7F');

        const wrapper = shallow(<AppDenied {...props} />);

        expect(wrapper.find('#application-unit').text()).toEqual('Fake Building Unit 7F')
    });

    it('displays normalized street address and unit number when no building name', () => {
        const props = buildProps(null, '123 Fake Street', '7F');

        const wrapper = shallow(<AppDenied {...props} />);

        expect(wrapper.find('#application-unit').text()).toEqual('123 Fake Street Unit 7F')
    });
});