import React from 'react';
import { createMount } from '@material-ui/core/test-utils';

import { WelcomePage } from './WelcomePage';
import MockMountableApp from 'utils/MockMountableApp';

describe('WelcomePage', () => {
    let mount;
    let defaultProps;
    beforeEach(() => {
        mount = createMount();

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

    afterEach(() => {
        mount.cleanUp();
    });

    const renderWelcomePage = (props) => {
        const wrapper = mount(
            <MockMountableApp config={props.configuration}>
                <WelcomePage {...props} />
            </MockMountableApp>
        );

        return wrapper.find(WelcomePage);
    };

    it('renders Hello <person name> when person is included in configuration', () => {
        const wrapper = renderWelcomePage(defaultProps);

        expect(wrapper.text().includes('Hello Callie,')).toBeTruthy();
    });

    it('renders Hi There, when person is not included in configuration', () => {
        delete defaultProps.configuration.person;
        const wrapper = renderWelcomePage(defaultProps);

        expect(wrapper.text().includes('Hi There,')).toBeTruthy();
    });

    it('renders Hi <invitee_name>, when invitee is included in configuration', function () {
        delete defaultProps.configuration.person;
        defaultProps.configuration.invitee = { first_name: 'Stinky' };
        const wrapper = renderWelcomePage(defaultProps);

        expect(wrapper.text().includes('Hello Stinky,')).toBeTruthy();
    });

    it('renders correct info when all client and unit info are passed', () => {
        const wrapper = renderWelcomePage(defaultProps);

        expect(wrapper.find('[data-testid="content"]').text()).toContain('Excelsior');
        expect(wrapper.find('[data-testid="content"]').text()).toContain('601 W 57TH ST');
        expect(wrapper.find('[data-testid="content"]').text()).toContain('New York, NY 10019');
        expect(wrapper.find('[data-testid="content"]').text()).toContain('Unit 4B');
    });

    it('renders correct info when all client and unit info is omitted', () => {
        delete defaultProps.configuration.unit;
        const wrapper = renderWelcomePage(defaultProps);

        expect(wrapper.find('[data-testid="content"]').text()).toContain('Excelsior');
        expect(wrapper.find('[data-testid="content"]').text()).toContain('601 W 57TH ST');
        expect(wrapper.find('[data-testid="content"]').text()).toContain('New York, NY 10019');
        expect(wrapper.find('[data-testid="content"]').text()).not.toContain('Unit 4B');
    });
});
