import React from 'react';
import { mount } from 'enzyme';

import { AppAdverseActions } from './AppAdverseActions';
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
        configuration: {
            credit_score_rating_config: [
                [0, "Poor"],
                [550, "Good"],
                [650, "Great"],
            ]
        },
    };
});

it('Matches Snapshot without security deposit', async () => {
    API.getAdverseActions = jest.fn().mockReturnValue(Promise.resolve({}));
    let wrapper = mount( <AppAdverseActions {...defaultProps}/> );
    await act(async () => {
        await Promise.resolve(wrapper);
        wrapper.update();
    });
    expect(wrapper.debug()).toMatchSnapshot();
});

it('Matches Snapshot with security deposit', async () => {
    API.getAdverseActions = jest.fn().mockReturnValue(Promise.resolve({}));
    let wrapper = mount( <AppAdverseActions {...defaultProps} securityDeposit={'$2,200'} /> );
    await act(async () => {
        await Promise.resolve(wrapper);
        wrapper.update();
    });
    expect(wrapper.debug()).toMatchSnapshot();
});

it('Do not display adverseFactorsList when no factor and no credit data', async () => {
    API.getAdverseActions = jest.fn().mockReturnValue(Promise.resolve({}));
    let wrapper = mount( <AppAdverseActions {...defaultProps}/> );
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
    let wrapper = mount( <AppAdverseActions {...defaultProps}/> );
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
    let wrapper = mount( <AppAdverseActions {...defaultProps}/> );
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
    let wrapper = mount( <AppAdverseActions {...defaultProps}/> );
    await act(async () => {
        await Promise.resolve(wrapper);
        wrapper.update();
    });
    expect(wrapper.debug()).toMatchSnapshot();
});

describe('Credit score color', function() {
    it('Display color gray when no credit score', async () => {
        API.getAdverseActions = jest.fn().mockReturnValue(Promise.resolve({
            adverse_factors: [],
            request_date :'2020-05-07T07:43:58.47',
            credit_score: null
        }));
        let wrapper = mount( <AppAdverseActions {...defaultProps}/> );
        await act(async () => {
            await Promise.resolve(wrapper);
            wrapper.update();
        });
        expect(wrapper.debug()).toMatchSnapshot();
    });

    it('Display color red when bad credit score', async () => {
        API.getAdverseActions = jest.fn().mockReturnValue(Promise.resolve({
            adverse_factors: [],
            request_date :'2020-05-07T07:43:58.47',
            credit_score: 300
        }));
        let wrapper = mount( <AppAdverseActions {...defaultProps}/> );
        await act(async () => {
            await Promise.resolve(wrapper);
            wrapper.update();
        });
        expect(wrapper.debug()).toMatchSnapshot();
    });

    it('Display color yellow when average credit score', async () => {
        API.getAdverseActions = jest.fn().mockReturnValue(Promise.resolve({
            adverse_factors: [],
            request_date :'2020-05-07T07:43:58.47',
            credit_score: 600
        }));
        let wrapper = mount( <AppAdverseActions {...defaultProps}/> );
        await act(async () => {
            await Promise.resolve(wrapper);
            wrapper.update();
        });
        expect(wrapper.debug()).toMatchSnapshot();
    });

    it('Display color green when good credit score', async () => {
        API.getAdverseActions = jest.fn().mockReturnValue(Promise.resolve({
            adverse_factors: [],
            request_date :'2020-05-07T07:43:58.47',
            credit_score: 800
        }));
        let wrapper = mount( <AppAdverseActions {...defaultProps}/> );
        await act(async () => {
            await Promise.resolve(wrapper);
            wrapper.update();
        });
        expect(wrapper.debug()).toMatchSnapshot();
    });

    it('Display color grey when no credit score rating', async () => {
        const configuration = {
            credit_score_rating_config: [],
        };
        API.getAdverseActions = jest.fn().mockReturnValue(Promise.resolve({
            adverse_factors: [],
            request_date :'2020-05-07T07:43:58.47',
            credit_score: 800
        }));
        let wrapper = mount( <AppAdverseActions {...defaultProps} configuration={configuration}/> );
        await act(async () => {
            await Promise.resolve(wrapper);
            wrapper.update();
        });
        expect(wrapper.debug()).toMatchSnapshot();
    });
});