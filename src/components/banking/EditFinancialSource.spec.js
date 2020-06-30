import React from 'react';
import { shallow } from 'enzyme';
import { EditFinancialSource } from './EditFinancialSource';

let defaultProps;
beforeEach(() => {
    defaultProps = {
        match: {
            params: {
                id: '666'
            }
        }
    }
})

it('sets initial values', () => {
    const wrapper = shallow(<EditFinancialSource {...defaultProps}/>);
});
