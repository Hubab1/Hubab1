import React from 'react';
import { shallow } from 'enzyme';
import { Formik } from 'formik';

import { MultiSelectChoice } from 'components/profile/options/MultiSelect';
import { RentalProfileOptions } from './RenterProfileOptions';

let defaultProps;

beforeEach(() => {
    defaultProps = {
        updateRenterProfile: jest.fn(),
        profile: {
            selected_rental_options: []
        },
        config: null
    }
})

it('renders a MultiSelectChoice component for each option in rental_options_config', function() {
    let wrapper = shallow( <RentalProfileOptions {...defaultProps} config={{rental_options_config: {guarantor: {limit: 1}, co_applicants: {limit: 1}}}}/> );
    wrapper = wrapper.find(Formik).dive();
    expect(wrapper.find(MultiSelectChoice).length).toEqual(2);
});
