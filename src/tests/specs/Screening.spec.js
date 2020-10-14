import React from 'react';
import { shallow } from 'enzyme';

import {Screening} from 'components/Screening';
import SocialSecurityInput from 'components/common/SocialSecurityInput';
import GenericFormMessage from 'components/common/GenericFormMessage';

it('Match initial snapshot', function() {
    const props = {
        applicant: {
            id: 123,
            first_name: 'Chakib',
        },
        buildingName: 'The blue building.'
    };

    const wrapper = shallow( <Screening {...props} />);
    expect(wrapper.getElement()).toMatchSnapshot();
});

it('Display SSN field by default', function() {
    const props = {
        applicant: {
            id: 123,
            first_name: 'Chakib'
        },
        buildingName: 'The blue building.'
    };

    const wrapper = shallow( <Screening {...props} />);
    expect(wrapper.find('Formik').dive().find(SocialSecurityInput).length).toEqual(1);
});

it('shows generic error message', function() {
    const props = {
        applicant: {
            id: 123,
            first_name: 'Chakib'
        },
        buildingName: 'The blue building.'
    };

    const wrapper = shallow(<Screening {...props} />);
    wrapper.setState({errors: ['some error']});
    expect(wrapper.find('Formik').dive().find(GenericFormMessage).length).toBe(1);
});
