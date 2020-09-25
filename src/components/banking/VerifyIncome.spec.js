import React from 'react';
import { shallow } from 'enzyme';
import VerifyIncome from './VerifyIncome';

let defaultProps;
beforeEach(() => {
    defaultProps = {
        errors: 'Some random error'
    };
});


it('matches snapshot', () => {
    const wrapper = shallow(<VerifyIncome {...defaultProps}/>);
    expect(wrapper.getElement()).toMatchSnapshot();
});
