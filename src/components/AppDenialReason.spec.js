import React from 'react';
import { shallow } from 'enzyme';

import DenialReason from 'components/AppDenialReason';


let defaultProps;

beforeEach(() => {
    defaultProps = {
        date: '5/6/2020',
        buildingName: 'Monterey Pines Apartments',
        unitNumber: 'Unit 14F',
        name: 'John Doe',
        onAgree: jest.fn(),
    };
});

it('Matches Snapshot', function() {
    let wrapper = shallow( <DenialReason {...defaultProps}/> );
    expect(wrapper.getElement()).toMatchSnapshot();
});

it('Do not display adverseFactorsList when no factor', function() {
    let wrapper = shallow( <DenialReason {...defaultProps} adverseFactors={[]}/> );
    expect(wrapper.getElement()).toMatchSnapshot();
});

it('Display adverseFactorsList when Factors', function() {
    const factors = [
        'Too few open revolving accounts',
        'Bankcard account balances are too high in proportion to credit limits',
        'Insufficient payment activity',
        'Not enough debt experience',
    ];
    let wrapper = shallow( <DenialReason {...defaultProps} adverseFactors={factors}/> );
    expect(wrapper.getElement()).toMatchSnapshot();
});