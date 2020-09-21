import React from 'react';
import { shallow } from 'enzyme';
import GuarantorExplanation from './GuarantorExplanation';

let defaultProps;
beforeEach(() => {
    defaultProps = {
        onAgree: jest.fn(),
        contactPhone: '1234445510'
    }
})

it('matches snapshot', () => {
    const wrapper = shallow(<GuarantorExplanation {...defaultProps} />);
    expect(wrapper.getElement()).toMatchSnapshot();
});
