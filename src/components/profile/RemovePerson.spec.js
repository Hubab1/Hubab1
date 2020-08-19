import React from 'react';
import { shallow } from 'enzyme';

import mockConfig from 'reducers/mock-config.json';
import mockApplication from 'reducers/mock-profile.json';
import mockProfile from 'reducers/mock-profile.json';
import { RemovePerson } from 'components/profile//RemovePerson';


let defaultProps, fetchRenterProfile;

beforeEach(() => {
    fetchRenterProfile = jest.fn().mockResolvedValue({});
    defaultProps = {
        fetchRenterProfile: fetchRenterProfile,
        profile: {
            ...mockProfile,
            dependents: [{id: 1, first_name: 'John', last_name: 'Doe', birthday: null}]
        },
        application: mockApplication,
        config: mockConfig,
    }
});

it('matches snapshot: case dependent', function() {
    let wrapper = shallow(<RemovePerson
        {...defaultProps}
        match={{params: {id: 1, type: 'dependent'}, isExact: true, path: "", url: ""}}
    /> );

    expect(wrapper.getElement()).toMatchSnapshot();
});