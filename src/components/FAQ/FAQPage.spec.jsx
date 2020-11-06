import React from 'react';
import { shallow } from 'enzyme';
import { FAQ } from './FAQ';

describe('FAQPage', () => {
    it('matches snapshot', () => {
        const wrapper = shallow(<FAQ community={{ building_name: 'Community Name' }} />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
