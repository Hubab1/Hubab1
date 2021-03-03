import React from 'react';
import { shallow } from 'enzyme';

import API from 'app/api';
import { RemoveFinancialSource } from './RemoveFinancialSource';
import ActionButton from 'components/common/ActionButton/ActionButton';
import { FINANCIAL_STREAM_INCOME, FINANCIAL_STREAM_ASSET } from 'app/constants';

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
    const wrapper = await shallow(<RemoveFinancialSource {...defaultProps} />);

    wrapper.find(ActionButton).at(0).simulate('click');
    expect(API.deleteFinancialSource).toHaveBeenCalledWith('666');
});

it('snapshot when isAsset=true', async () => {
    API.deleteFinancialSource = jest.fn().mockReturnValue({});
    API.getFinancialSource = jest.fn().mockReturnValue({});
    const wrapper = await shallow(<RemoveFinancialSource {...defaultProps} />, { disableLifecycleMethods: true });
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
    const wrapper = await shallow(<RemoveFinancialSource {...defaultProps} />, { disableLifecycleMethods: true });
    wrapper.setState({
        financialSource: {
            stream_type: FINANCIAL_STREAM_INCOME,
        },
    });
    expect(wrapper.getElement()).toMatchSnapshot();
});
