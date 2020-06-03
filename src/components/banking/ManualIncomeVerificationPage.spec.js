import React from 'react';
import { shallow } from 'enzyme';
import ManualIncomeVerificationPage from './ManualIncomeVerificationPage';

let defaultProps;
beforeEach(() => {
    defaultProps = {
        goBack: jest.fn()
    }
})

it('matches snapshot', () => {
    const wrapper = shallow(<ManualIncomeVerificationPage {...defaultProps}/>);
    expect(wrapper.getElement()).toMatchSnapshot();
});
