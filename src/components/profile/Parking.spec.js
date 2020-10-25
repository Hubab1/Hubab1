import React from 'react';
import { shallow } from 'enzyme';
import { Formik } from 'formik';

import ItemAdder from 'components/common/ItemAdder';
import { Parking } from 'components/profile/Parking';
import mockConfig from 'reducers/mock-config.json';
import mockApplication from 'reducers/mock-profile.json';
import ActionButton from 'components/common/ActionButton/ActionButton';

let defaultProps;

beforeEach(() => {
    defaultProps = {
        config: mockConfig,
        application: mockApplication,
    };
});

it('renders a ItemAdder component for each option in config.rental_options.parking', function () {
    let wrapper = shallow(<Parking {...defaultProps} />);
    wrapper = wrapper.find(Formik).dive();
    expect(wrapper.find(ItemAdder).length).toEqual(2);
    expect(wrapper.find(ItemAdder).at(0).prop('subtitle')).toContain('(1 incl.)');
    expect(wrapper.find(ItemAdder).at(1).prop('subtitle')).not.toContain('incl.');
    expect(wrapper.find(ActionButton).prop('disabled')).toBe(true);
});
