import React from 'react';
import { shallow } from 'enzyme';
import { Formik } from 'formik';

import ItemAdder from 'components/common/ItemAdder';
import { WineCooler } from 'components/profile/WineCooler';
import mockConfig from 'reducers/mock-config.json';
import mockApplication from 'reducers/mock-profile.json';
import ActionButton from 'components/common/ActionButton/ActionButton';
import { PAYMENT_TIME_MONTHLY } from 'app/constants';

let defaultProps;

beforeEach(() => {
    defaultProps = {
        config: mockConfig,
        application: mockApplication,
    };
});

it('renders a ItemAdder component for each wine cooler option', function () {
    let wrapper = shallow(<WineCooler {...defaultProps} />);
    wrapper = wrapper.find(Formik).dive();
    expect(wrapper.find(ItemAdder).length).toEqual(2);
    expect(wrapper.find(ItemAdder).at(0).dive().text()).toContain('(1 incl.)');
    expect(wrapper.find(ItemAdder).at(1).dive().text()).not.toContain('incl.');
    expect(wrapper.find(ActionButton).prop('disabled')).toBe(true);
});

it('Displays multiple lines when pricing group set', () => {
    const rentalOption = {
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
                amount: '55.00',
                id: 282,
                name: 'Red Wine Cooler',
                payment_time: PAYMENT_TIME_MONTHLY,
                pricing_tier: 1,
                refundable: false,
            },
            {
                amount: '50.00',
                id: 3391,
                name: 'Red Wine Cooler',
                payment_time: PAYMENT_TIME_MONTHLY,
                pricing_tier: 2,
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
                        { max_value: 3, min_value: 1, tier_num: 1 },
                        { max_value: 5, min_value: 3, tier_num: 2 },
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

    const config = { ...defaultProps.config };
    config.rental_options = {
        'wine-cooler': [rentalOption],
    };

    let wrapper = shallow(<WineCooler {...defaultProps} config={config} />);
    wrapper = wrapper.find(Formik).dive();
    expect(wrapper.find(ItemAdder).length).toEqual(1);
    expect(wrapper.find(ItemAdder).at(0).dive().text()).toContain('Red Wine Cooler');
    expect(wrapper.find(ItemAdder).at(0).dive().text()).toContain('$105.00/mo per wine cooler (1 incl.)');
    expect(wrapper.find(ItemAdder).at(0).dive().text()).toContain('$55.00/mo per wine cooler after 1 paid');
    expect(wrapper.find(ItemAdder).at(0).dive().text()).toContain('$50.00/mo per wine cooler after 3 paid');
});
