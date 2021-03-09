import React from 'react';
import { shallow } from 'enzyme';
import { Formik } from 'formik';

import { PAYMENT_TIME_MONTHLY } from 'constants/constants';
import mockConfig from 'reducers/tests/mock-config.json';
import mockApplication from 'reducers/tests/mock-profile.json';

import { WineCoolerPage } from './WineCoolerPage';
import ItemAdder from 'common-components/ItemAdder/ItemAdder';
import ActionButton from 'common-components/ActionButton/ActionButton';

let defaultProps;
let rentalOption;

beforeEach(() => {
    defaultProps = {
        config: mockConfig,
        application: mockApplication,
    };

    rentalOption = {
        id: 270,
        included: 1,
        leasing_category: 'wine-cooler',
        limit: 3,
        mandatory: false,
        monthly_amount: '105.00',
        name: 'Red Wine Cooler',
        payment_time: 10,
        fee_amount: '100.00',
        fees: [
            {
                amount: '100.00',
                id: 3392,
                name: 'Red Wine Cooler',
                payment_time: 999, // some other payment time
                pricing_tier: 1,
                refundable: false,
            },
            {
                amount: '40.00',
                id: 282,
                name: 'Red Wine Cooler',
                payment_time: PAYMENT_TIME_MONTHLY,
                pricing_tier: 1,
                refundable: false,
            },
            {
                amount: '30.00',
                id: 3391,
                name: 'Red Wine Cooler',
                payment_time: PAYMENT_TIME_MONTHLY,
                pricing_tier: 2,
                refundable: false,
            },
            {
                amount: '20.00',
                id: 3391,
                name: 'Red Wine Cooler',
                payment_time: PAYMENT_TIME_MONTHLY,
                pricing_tier: 3,
                refundable: false,
            },
        ],
        rental_option_pricing_group: {
            community: 38,
            id: 2,
            name: 'Wine Cooler Pricing Group',
            tiers: [
                {
                    payment_time: PAYMENT_TIME_MONTHLY,
                    tiers: [
                        { max_value: 2, min_value: 1, tier_num: 1 },
                        { max_value: 5, min_value: 2, tier_num: 2 },
                        { max_value: null, min_value: 5, tier_num: 3 },
                    ],
                },
                {
                    payment_time: 999, // some other payment time
                    tiers: [{ max_value: 100, min_value: 1, tier_num: 1 }],
                },
            ],
        },
    };
});

it('renders a ItemAdder component for each wine cooler option', function () {
    let wrapper = shallow(<WineCoolerPage {...defaultProps} />);
    wrapper = wrapper.find(Formik).dive();
    expect(wrapper.find(ItemAdder).length).toEqual(2);
    expect(wrapper.find(ItemAdder).at(0).dive().text()).toContain('(1 incl.)');
    expect(wrapper.find(ItemAdder).at(1).dive().text()).not.toContain('incl.');
    expect(wrapper.find(ActionButton).prop('disabled')).toBe(true);
});

describe('submit button label', () => {
    it('says Add Wine Cooler when initalWineCoolerOptions total quantity is 0', () => {
        const wrapper = shallow(<WineCoolerPage {...defaultProps} />);
        const formik = wrapper.find(Formik).dive();
        expect(formik.find(ActionButton).length).toBe(1);
        expect(formik.find(ActionButton).childAt(0).text()).toBe('Add Wine Cooler');
    });

    it('says Save Changes when initialWineCoolerOptions total quantity is > 0', () => {
        defaultProps.application.selected_rental_options = {
            'wine-cooler': [{ quantity: 1, rental_option: { id: 270 } }],
        };

        const config = { ...defaultProps.config };
        config.rental_options = {
            'wine-cooler': [rentalOption],
        };

        const wrapper = shallow(<WineCoolerPage {...defaultProps} confit={config} />);
        const formik = wrapper.find(Formik).dive();

        expect(formik.find(ActionButton).length).toBe(1);
        expect(formik.find(ActionButton).childAt(0).text()).toBe('Save Changes');
    });
});

it('Displays multiple lines when pricing group set', () => {
    const config = { ...defaultProps.config };
    config.rental_options = {
        'wine-cooler': [rentalOption],
    };

    let wrapper = shallow(<WineCoolerPage {...defaultProps} config={config} />);
    wrapper = wrapper.find(Formik).dive();
    expect(wrapper.find(ItemAdder).length).toEqual(1);
    expect(wrapper.find(ItemAdder).at(0).dive().text()).toContain('Red Wine Cooler');
    expect(wrapper.find(ItemAdder).at(0).dive().text()).toContain('1 included');
    expect(wrapper.find(ItemAdder).at(0).dive().text()).toContain('$40.00/mo for paid wine cooler 1');
    expect(wrapper.find(ItemAdder).at(0).dive().text()).toContain('$30.00/mo for paid wine coolers 2-4');
    expect(wrapper.find(ItemAdder).at(0).dive().text()).toContain('$20.00/mo for paid wine coolers 5+');
});
