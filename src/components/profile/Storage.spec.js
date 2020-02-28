import React from 'react';
import { shallow } from 'enzyme';
import { Formik } from 'formik';

import ItemAdder from 'components/common/ItemAdder';
import { Storage } from 'components/profile/Storage';
import mockConfig from 'reducers/mock-config.json';
import mockApplication from 'reducers/mock-profile.json';


let defaultProps;

beforeEach(() => {
    defaultProps = {
        config: mockConfig,
        application: mockApplication,
    };
});

it('renders a ItemAdder component for each option in config.rental_options.storage', function() {
    let wrapper = shallow( <Storage {...defaultProps}/> );
    wrapper = wrapper.find(Formik).dive();
    expect(wrapper.find(ItemAdder).length).toEqual(2);
});
