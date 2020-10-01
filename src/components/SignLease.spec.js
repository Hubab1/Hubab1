import React from 'react';
import { shallow } from 'enzyme';
import ActionButton from 'components/common/ActionButton/ActionButton';
import API from 'app/api';
import { SignLease } from 'components/SignLease';
import { PaymentDetailsCard } from 'components/payment-details/PaymentDetailsCard';
import { Link } from 'react-router-dom';
import { ROUTES } from 'app/constants';

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

describe('renders the component', () => {
    const props = buildProps('Fake Building', '123 Fake Street', null);
    const wrapper = shallow(<SignLease {...props} />);

    it('matches snapshot', () => {
        expect(wrapper.getElement()).toMatchSnapshot();
    });

    it('renders the correct elements', () => {
        expect(wrapper.find(PaymentDetailsCard)).toHaveLength(1);
        expect(wrapper.find(ActionButton)).toHaveLength(1);
        expect(wrapper.find(Link).prop('to')).toBe(ROUTES.APP_APPROVED);
    });
});

describe('hellosign modal', () => {
    it('fetches embedded signing url before opening', () => {
        const props = buildProps('Fake Building', '123 Fake Street', null);
        API.embeddedSigningUrl = jest.fn().mockReturnValue({ url: 'test' });
        API.fetchApplicant = jest.fn().mockReturnValue({ events: [] });
        const wrapper = shallow(<SignLease {...props} />);
        wrapper.find(ActionButton).simulate('click');
        expect(API.embeddedSigningUrl).toHaveBeenCalled();
    });
});
