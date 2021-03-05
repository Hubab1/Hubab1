import React from 'react';
import { shallow } from 'enzyme';

import { FINANCIAL_STREAM_INCOME, FINANCIAL_STREAM_ASSET } from 'constants/constants';
import API from 'api/api';
import { RemoveFinancialSourcePage } from './RemoveFinancialSourcePage';
import ActionButton from 'components//ActionButton/ActionButton';

let defaultProps;
beforeEach(() => {
    defaultProps = {
        match: {
            params: {
                id: '666',
            },
        },
        history: {
            push: jest.fn(),
        },
    };
});

it('delete financial source on submit', async () => {
    API.deleteFinancialSource = jest.fn().mockReturnValue({});
    API.getFinancialSource = jest.fn().mockReturnValue({});
    const wrapper = await shallow(<RemoveFinancialSourcePage {...defaultProps} />);

    wrapper.find(ActionButton).at(0).simulate('click');
    expect(API.deleteFinancialSource).toHaveBeenCalledWith('666');
});

it('snapshot when isAsset=true', async () => {
    API.deleteFinancialSource = jest.fn().mockReturnValue({});
    API.getFinancialSource = jest.fn().mockReturnValue({});
    const wrapper = await shallow(<RemoveFinancialSourcePage {...defaultProps} />, { disableLifecycleMethods: true });
    wrapper.setState({
        financialSource: {
            stream_type: FINANCIAL_STREAM_ASSET,
        },
    });
    expect(wrapper.getElement()).toMatchSnapshot();
});

it('snapshot when isAsset=false', async () => {
    API.deleteFinancialSource = jest.fn().mockReturnValue({});
    API.getFinancialSource = jest.fn().mockReturnValue({});
    const wrapper = await shallow(<RemoveFinancialSourcePage {...defaultProps} />, { disableLifecycleMethods: true });
    wrapper.setState({
        financialSource: {
            stream_type: FINANCIAL_STREAM_INCOME,
        },
    });
    expect(wrapper.getElement()).toMatchSnapshot();
});
