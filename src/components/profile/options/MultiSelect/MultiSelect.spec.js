import React from 'react';
import { shallow } from 'enzyme';

import { MultiSelect } from '../MultiSelect';

let defaultProps;
beforeEach(() => {
    defaultProps = {
        onChange: jest.fn(),
        value: ['parking']
    };
})

it('adds item to value array', function () {
    const wrapper = shallow(<MultiSelect {...defaultProps} />);
    wrapper.instance().onClick('pets');
    expect(defaultProps.onChange).toHaveBeenCalledWith(['parking', 'pets']);
});

it('removes item from value array', function () {
    const wrapper = shallow(<MultiSelect {...defaultProps} value={['parking', 'pets']}/>);
    wrapper.instance().onClick('pets');
    expect(defaultProps.onChange).toHaveBeenCalledWith(['parking']);
});
