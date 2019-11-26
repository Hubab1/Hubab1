import React from 'react';
import { shallow } from 'enzyme';
import { Formik } from 'formik';

import ItemAdder from 'components/common/ItemAdder';
import { Storage } from 'components/profile/Storage';
import mockConfig from 'reducers/mock-config.json';

let defaultProps;

beforeEach(() => {
    defaultProps = {
        config: mockConfig
    }
})

it('renders a ItemAdder component for each option in rental_options_config.storage', function() {
    let wrapper = shallow( <Storage {...defaultProps}/> );
    wrapper = wrapper.find(Formik).dive();
    expect(wrapper.find(ItemAdder).length).toEqual(2);
});
