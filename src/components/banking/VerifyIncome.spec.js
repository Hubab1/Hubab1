import React from 'react';
import { shallow } from 'enzyme';
import VerifyIncome from './VerifyIncome';

let defaultProps;
let mockUseContext;

beforeEach(() => {
    mockUseContext = jest.spyOn(React, 'useContext');
    defaultProps = {
        errors: 'Some random error',
    };
});

afterEach(() => {
    jest.clearAllMocks();
});

it('matches snapshot when route is selected', () => {
    const wrapper = shallow(<VerifyIncome {...defaultProps} />);
    expect(wrapper.getElement()).toMatchSnapshot();
});
