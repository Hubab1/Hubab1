import React from 'react';
import { shallow } from 'enzyme';

import API from 'app/api';
import { RemoveFinancialSource } from './RemoveFinancialSource';
import ActionButton from 'components/common/ActionButton/ActionButton';

let defaultProps;
beforeEach(() => {
    defaultProps = {
        match: {
            params: {
                id: '666'
            }
        },
        history: {
            push: jest.fn()
        }
    }
})

it('delete financial source on submit', async () => {
    API.deleteFinancialSource = jest.fn().mockReturnValue({});
    API.getFinancialSource = jest.fn().mockReturnValue({});
    const wrapper = await shallow(<RemoveFinancialSource {...defaultProps}/>);
    wrapper.find(ActionButton).at(0).simulate('click');
    expect(API.deleteFinancialSource).toHaveBeenCalledWith('666');
});
