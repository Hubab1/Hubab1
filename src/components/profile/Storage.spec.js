import React from 'react';
import { shallow } from 'enzyme';
import { Formik } from 'formik';

import ItemAdder from 'components/common/ItemAdder';
import { Storage } from 'components/profile/Storage';
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

it('renders a ItemAdder component for each option in config.rental_options.storage', function () {
    let wrapper = shallow(<Storage {...defaultProps} />);
    wrapper = wrapper.find(Formik).dive();
    expect(wrapper.find(ItemAdder).length).toEqual(2);
    expect(wrapper.find(ActionButton).prop('disabled')).toBe(true);
});

it('Displays multiple lines when pricing group set', () => {
    const rentalOption = {
        id: 270,
        included: 1,
        leasing_category: 'storage',
        limit: 3,
        mandatory: false,
        monthly_amount: '105.00',
        name: 'Nice Storage',
        payment_time: 10,
        fee_amount: '100.00',
        fees: [
            {
                amount: '100.00',
                id: 3392,
                name: 'Nice Storage',
                payment_time: 999, // some other payment time
                pricing_tier: 1,
                refundable: false,
            },
            {
                amount: '40.00',
                id: 282,
                name: 'Nice Storage',
                payment_time: PAYMENT_TIME_MONTHLY,
                pricing_tier: 1,
                refundable: false,
            },
            {
                amount: '30.00',
                id: 3391,
                name: 'Nice Storage',
                payment_time: PAYMENT_TIME_MONTHLY,
                pricing_tier: 2,
                refundable: false,
            },
            {
                amount: '20.00',
                id: 3394,
                name: 'Nice Storage',
                payment_time: PAYMENT_TIME_MONTHLY,
                pricing_tier: 3,
                refundable: false,
            },
        ],
        rental_option_pricing_group: {
            community: 38,
            id: 2,
            name: 'Storage Pricing Group',
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

    const config = { ...defaultProps.config };
    config.rental_options = {
        storage: [rentalOption],
    };

    let wrapper = shallow(<Storage {...defaultProps} config={config} />);
    wrapper = wrapper.find(Formik).dive();
    expect(wrapper.find(ItemAdder).length).toEqual(1);
    expect(wrapper.find(ItemAdder).at(0).dive().text()).toContain('Nice Storage');
    expect(wrapper.find(ItemAdder).at(0).dive().text()).toContain('1 included');
    expect(wrapper.find(ItemAdder).at(0).dive().text()).toContain('$40.00/mo for paid storage space 1');
    expect(wrapper.find(ItemAdder).at(0).dive().text()).toContain('$30.00/mo for paid storage spaces 2-4');
    expect(wrapper.find(ItemAdder).at(0).dive().text()).toContain('$20.00/mo for paid storage spaces 5+');
});
