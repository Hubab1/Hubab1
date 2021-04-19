import React from 'react';
import { shallow } from 'enzyme';

import { MILESTONE_LEASE_SENT } from 'constants/constants';
import API from 'api/api';
import { SignLeaseView } from './SignLeaseView';

var mockhsclient;
jest.mock('utils/hsclient', () => {
    class HSclient {
        events = {};
        open = () => {};
        on = (name, cb) => {
            this.events[name] = cb;
        };
        _trigger = (name) => {
            this.events[name]();
        };
    }
    mockhsclient = new HSclient();
    return mockhsclient;
});

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
            client: {
                person: {
                    name: 'John Doe',
                },
            },
        },
        applicantUpdated: jest.fn(),
        fetchPayments: jest.fn(),
        payables: [],
        setShowPaymentDetails: jest.fn(),
        applicationFees: {},
    };
};

describe('hellosign modal', () => {
    it('fetches embedded signing url before opening', () => {
        const props = buildProps('Fake Building', '123 Fake Street', null);
        API.embeddedSigningUrl = jest.fn().mockReturnValue({ url: 'test', test_mode: true });
        API.fetchApplicant = jest.fn().mockReturnValue({ events: [] });
        const wrapper = shallow(<SignLeaseView {...props} />);
        wrapper.find('.sign-lease').simulate('click');
        expect(API.embeddedSigningUrl).toHaveBeenCalled();
    });
});

it('matches snapshot', () => {
    const props = buildProps('Fake Building', '123 Fake Street', null);
    const wrapper = shallow(<SignLeaseView {...props} />);
    expect(wrapper.getElement()).toMatchSnapshot();
});
