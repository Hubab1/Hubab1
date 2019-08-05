import React from 'react';
import { shallow } from 'enzyme';

import { ApplicationFeePage } from './ApplicationFeePage';

let defaultProps;
beforeEach(() => {
    defaultProps = {
        configuration: {
            application_fee: 60.567
        },
        profile: {
            primary_applicant: {
                first_name: "Bob"
            }
        },
        applicant: { client: { person: { first_name: 'Bob' } } }
    }
})

it('Inserts fee and first name in template', function() {
    const wrapper = shallow( <ApplicationFeePage {...defaultProps}/> );
    expect(wrapper.text()).toContain('Almost There, Bob!')
    expect(wrapper.text()).toContain('The application fee for this apartment is $60.57')
});
