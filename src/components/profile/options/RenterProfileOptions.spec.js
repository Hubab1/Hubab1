import React from 'react';
import { shallow } from 'enzyme';
import { Formik } from 'formik';

import { MultiSelectChoice } from 'components/profile/options/MultiSelect';
import { RentalProfileOptions } from './RenterProfileOptions';
import mockConfig from 'reducers/mock-config.json';


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
    const wrapper = shallow( <RentalProfileOptions {...defaultProps} config={{rental_options_config: {guarantor: {limit: 1}, co_applicants: {limit: 1}}}}/> );
    const formikWrapper = wrapper.find(Formik).dive();
    expect(formikWrapper.find(MultiSelectChoice).length).toEqual(2);
});

it('renders rental_option_config choices in correct order', () => {
    const wrapper = shallow( <RentalProfileOptions {...defaultProps} config={mockConfig}/> );
    const formikWrapper = wrapper.find(Formik).dive();

    expect(formikWrapper.find(MultiSelectChoice).first().props()['name']).toEqual('co_applicants');
    expect(formikWrapper.find(MultiSelectChoice).at(1).props()['name']).toEqual('guarantor');
    expect(formikWrapper.find(MultiSelectChoice).at(2).props()['name']).toEqual('pets');
    expect(formikWrapper.find(MultiSelectChoice).at(3).props()['name']).toEqual('parking');
    expect(formikWrapper.find(MultiSelectChoice).last().props()['name']).toEqual('storage');

});
