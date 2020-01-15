import React from 'react';
import { shallow } from 'enzyme';

import RenterProfileListItem from 'components/profile/options/RenterProfileListItem';
import { RentalProfileOptions } from './RenterProfileOptions';
import mockConfig from 'reducers/mock-config.json';
import mockProfile from 'reducers/mock-profile.json';


let defaultProps;

beforeEach(() => {
    defaultProps = {
        updateRenterProfile: jest.fn(),
        profile: mockProfile,
        config: mockConfig
    }
})

it('renders a RenterProfileListItem component for each option in rental_options_config', function() {
    const wrapper = shallow( <RentalProfileOptions {...defaultProps} /> );
    expect(wrapper.find(RenterProfileListItem).length).toEqual(5);
});

it('matches snapshot', () => {
    const wrapper = shallow( <RentalProfileOptions {...defaultProps} /> );
    expect(wrapper.getElement()).toMatchSnapshot();
});

it('renders rental_option_config choices in correct order', () => {
    const wrapper = shallow( <RentalProfileOptions {...defaultProps} config={mockConfig}/> );

    expect(wrapper.find(RenterProfileListItem).first().props()['name']).toEqual('co_applicants');
    expect(wrapper.find(RenterProfileListItem).at(1).props()['name']).toEqual('guarantor');
    expect(wrapper.find(RenterProfileListItem).at(2).props()['name']).toEqual('pets');
    expect(wrapper.find(RenterProfileListItem).at(3).props()['name']).toEqual('parking');
    expect(wrapper.find(RenterProfileListItem).last().props()['name']).toEqual('storage');

});
