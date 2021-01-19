import React from 'react';
import { shallow } from 'enzyme';

import { WelcomePage } from './WelcomePage';
import { CallToActionButton, WelcomeTextContainer } from './styles';

let defaultProps;
beforeEach(() => {
    defaultProps = {
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
            },
            unit: {
                id: 2747820,
                unit_number: '4B',
            },
        },
    };
});

it('renders Hello <person name> when person is included in configuration', function () {
    const wrapper = shallow(<WelcomePage {...defaultProps} />);

    expect(wrapper.text().includes('Hello Callie,')).toBeTruthy();
});

it('renders Hi There, when person is not included in configuration', function () {
    delete defaultProps.configuration.person;
    const wrapper = shallow(<WelcomePage {...defaultProps} />);

    expect(wrapper.text().includes('Hi There,')).toBeTruthy();
});

it('renders Hi <invitee_name>, when invitee is included in configuration', function () {
    delete defaultProps.configuration.person;
    defaultProps.configuration.invitee = { first_name: 'Stinky' };
    const wrapper = shallow(<WelcomePage {...defaultProps} />);

    expect(wrapper.text().includes('Hello Stinky,')).toBeTruthy();
});

it('renders correct info when all client and unit info are passed', () => {
    const wrapper = shallow(<WelcomePage {...defaultProps} />);

    expect(wrapper.find(WelcomeTextContainer).text()).toContain('Excelsior');
    expect(wrapper.find(WelcomeTextContainer).text()).toContain('601 W 57TH ST');
    expect(wrapper.find(WelcomeTextContainer).text()).toContain('New York, NY 10019');
    expect(wrapper.find(WelcomeTextContainer).text()).toContain('Unit 4B');
});

it('renders correct info when all client and unit info is omitted', () => {
    delete defaultProps.configuration.unit;

    const wrapper = shallow(<WelcomePage {...defaultProps} />);

    expect(wrapper.find(WelcomeTextContainer).text()).toContain('Excelsior');
    expect(wrapper.find(WelcomeTextContainer).text()).toContain('601 W 57TH ST');
    expect(wrapper.find(WelcomeTextContainer).text()).toContain('New York, NY 10019');
    expect(wrapper.find(WelcomeTextContainer).text()).not.toContain('Unit 4B');
});

describe('configuration is set to darkmode', () => {
    beforeEach(() => {
        defaultProps.configuration.dark_mode = true;
    });

    it('renders the call to action button with the default white background', () => {
        const wrapper = shallow(<WelcomePage {...defaultProps} />);
        const buttonStyle = wrapper.find(CallToActionButton).get(0).props.style;
        expect(buttonStyle.background).toBe(undefined);
    });
});

describe('configuration is set to lightmode', () => {
    beforeEach(() => {
        defaultProps.configuration.dark_mode = false;
    });

    it('renders the call to action button with the configured primary color', () => {
        const wrapper = shallow(<WelcomePage {...defaultProps} />);
        const buttonStyle = wrapper.find(CallToActionButton).get(0).props.style;
        expect(buttonStyle.background).toBe(`#${defaultProps.configuration.primary_color}`);
    });
});
