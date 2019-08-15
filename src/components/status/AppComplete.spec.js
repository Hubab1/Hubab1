import React from 'react';
import { shallow } from 'enzyme';

import { AppComplete } from './AppComplete';
import { PersonRow } from './PersonRow';
import mockProfile from 'reducers/mock-profile';
import mockConfig from 'reducers/mock-config';
import mockApplicant from 'reducers/applicant-mock';


let defaultProps;
beforeEach(() => {
    defaultProps = {
        profile: mockProfile,
        configuration: mockConfig,
        applicant: mockApplicant,
    }
});

it('renders a PersonRow for each applicant and guarantor', () => {
    const wrapper = shallow(<AppComplete {...defaultProps}/>);

    expect(wrapper.find(PersonRow).length).toEqual(4);
});