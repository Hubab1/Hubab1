import React from 'react';
import { shallow } from 'enzyme';
import { FAQPage } from './FAQPage';

describe('FAQPage', () => {
    it('matches snapshot', () => {
        const wrapper = shallow(
            <FAQPage isSignedIn={true} config={{ community: { building_name: 'Community Name' } }} />
        );
        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
