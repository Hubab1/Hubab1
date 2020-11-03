import React from 'react';
import { shallow } from 'enzyme';
import { FAQPage } from './FAQPage';

describe('FAQPage', () => {
    it('matches snapshot', () => {
        const wrapper = shallow(<FAQPage />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
