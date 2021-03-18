import React from 'react';
import { shallow } from 'enzyme';
import FAQ from './FAQ';

describe('FAQ', () => {
    it('matches snapshot', () => {
        const wrapper = shallow(<FAQ community={{ building_name: 'Community Name' }} />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
