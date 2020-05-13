import React from 'react';
import { shallow, mount } from 'enzyme';

import DenialReason from 'components/AppDenialReason';
import API from 'app/api';
import {act} from "react-dom/test-utils";


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

it('Matches Snapshot', async () => {
    API.getAdverseActions = jest.fn().mockReturnValue(Promise.resolve({}));
    let wrapper = mount( <DenialReason {...defaultProps}/> );
    await act(async () => {
        await Promise.resolve(wrapper);
        wrapper.update();
    });
    expect(wrapper.debug()).toMatchSnapshot();
});

it('Do not display adverseFactorsList when no factor and no credit data', async () => {
    API.getAdverseActions = jest.fn().mockReturnValue(Promise.resolve({}));
    let wrapper = mount( <DenialReason {...defaultProps}/> );
    await act(async () => {
        await Promise.resolve(wrapper);
        wrapper.update();
    });
    expect(wrapper.debug()).toMatchSnapshot();
});

it('Display adverseFactorsList when Factors', async () => {
    const factors = [
        'Too few open revolving accounts',
        'Bankcard account balances are too high in proportion to credit limits',
        'Insufficient payment activity',
        'Not enough debt experience',
    ];
    API.getAdverseActions = jest.fn().mockReturnValue(Promise.resolve({
        adverse_factors :factors,
    }));
    let wrapper = mount( <DenialReason {...defaultProps}/> );
    await act(async () => {
        await Promise.resolve(wrapper);
        wrapper.update();
    });
    expect(wrapper.debug()).toMatchSnapshot();
});

it('Display credit data when available', async () => {
    API.getAdverseActions = jest.fn().mockReturnValue(Promise.resolve({
        adverse_factors: [],
        request_date :'2020-05-07T07:43:58.47',
        credit_score: '671'
    }));
    let wrapper = mount( <DenialReason {...defaultProps}/> );
    await act(async () => {
        await Promise.resolve(wrapper);
        wrapper.update();
    });
    expect(wrapper.debug()).toMatchSnapshot();
});

it('Display N/A when only credit date is available', async () => {
    API.getAdverseActions = jest.fn().mockReturnValue(Promise.resolve({
        adverse_factors: [],
        request_date :'2020-05-07T07:43:58.47',
        credit_score: '671'
    }));
    let wrapper = mount( <DenialReason {...defaultProps}/> );
    await act(async () => {
        await Promise.resolve(wrapper);
        wrapper.update();
    });
    expect(wrapper.debug()).toMatchSnapshot();
});