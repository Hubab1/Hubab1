import React from 'react';
import { shallow } from 'enzyme';

import mockProfile from 'reducers/tests/mock-profile';
import mockConfig from 'reducers/tests/mock-config';
import mockApplicant from 'reducers/tests/mock-applicant';
import { ApplicationCompletePage } from './ApplicationCompletePage';
import { PersonRow } from 'pages/ApplicationComplete/components/PersonRow/PersonRow';

let defaultProps;
beforeEach(() => {
    defaultProps = {
        profile: mockProfile,
        configuration: mockConfig,
        applicant: mockApplicant,
    };
});

it('renders a PersonRow for each applicant and guarantor', () => {
    const wrapper = shallow(<ApplicationCompletePage {...defaultProps} />);

    expect(wrapper.find(PersonRow).length).toEqual(5);
});
