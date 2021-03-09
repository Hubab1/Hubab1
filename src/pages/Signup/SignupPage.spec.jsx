import React from 'react';
import { shallow } from 'enzyme';

import { SignupPage } from './SignupPage';

let defaultProps;
beforeEach(() => {
    defaultProps = {
        history: {
            push: jest.fn(),
        },
        configuration: {
            application_fee: null,
            background: 'some background image url',
            community: {
                building_name: 'The Excelsior',
                building_number: '601',
                city: 'New York',
                normalized_street_address: '601 W 57TH ST',
                postal_code: '10019',
                state: 'NY',
            },
            id: 1,
            logo: 'logo of a pegasus flying over the moon',
            primary_color: '286165',
            secondary_color: 'FFFFFF',
            client: {
                id: 12222,
            },
            person: {
                email: 'callieapi@example.com',
                first_name: 'Callie',
                id: 280066,
                last_name: 'Api',
                phone_1: '1234543123',
                date_of_birth: '10-1-1990',
            },
            unit: {
                id: 2747820,
                unit_number: '4B',
            },
        },
        toggleLoader: jest.fn(),
    };
});

it('sets baseInitialValues to person when when person and client is included in the configuration', () => {
    const wrapper = shallow(<SignupPage {...defaultProps} />);
    const person = defaultProps.configuration.person;
    expect(wrapper.instance().applicantInfo).toMatchObject({
        first_name: person.first_name,
        last_name: person.last_name,
        phone_number: person.phone_1,
        email: person.email,
        id: defaultProps.configuration.client.id,
    });
});

it('sets baseInitialValues to invitee when when invitee is included in the configuration', () => {
    const invitee = defaultProps.person;
    delete defaultProps.person;
    delete defaultProps.client;
    defaultProps.invitee = invitee;
    const wrapper = shallow(<SignupPage {...defaultProps} />);

    const person = defaultProps.configuration.person;
    expect(wrapper.instance().applicantInfo).toMatchObject({
        first_name: person.first_name,
        last_name: person.last_name,
        phone_number: person.phone_1,
        email: person.email,
    });
});

it('displays sms opt in consent if not invitee', () => {
    const wrapper = shallow(<SignupPage {...defaultProps} />);
    expect(wrapper.find('AccountForm').prop('showConsentInput')).toEqual(true);
});

it('does not display sms opt in consent if invitee', () => {
    const props = {
        ...defaultProps,
        configuration: {
            ...defaultProps.configuration,
            invitee: defaultProps.configuration.person,
        },
    };
    const wrapper = shallow(<SignupPage {...props} />);
    expect(wrapper.find('AccountForm').prop('showConsentInput')).toEqual(false);
});
