import React from 'react';
import { shallow } from 'enzyme';
import { AddIncomeSource } from './AddIncomeSource';

let defaultProps;
beforeEach(() => {
    defaultProps = {
        goBack: jest.fn()
    }
})

it('matches snapshot', () => {
    const wrapper = shallow(<AddIncomeSource {...defaultProps}/>);
    expect(wrapper.getElement()).toMatchSnapshot();
});
