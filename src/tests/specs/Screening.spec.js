import React from 'react';
import { shallow } from 'enzyme';

import {Screening} from "components/Screening";
import SocialSecurityInput from 'components/common/SocialSecurityInput';

it('Match initial snapshot', function() {
    let props = {
        applicant: {
            id: 123,
            client: {
                person: {
                    first_name: 'Chakib'
                }
            }
        },
        buildingName: 'The blue building.'
    };

    const wrapper = shallow( <Screening {...props} />);
    expect(wrapper.getElement()).toMatchSnapshot();
});

it('Display SSN field by default', function() {
    let props = {
        applicant: {
            id: 123,
            client: {
                person: {
                    first_name: 'Chakib'
                }
            }
        },
        buildingName: 'The blue building.'
    };

    const wrapper = shallow( <Screening {...props} />);
    expect(wrapper.find('Formik').dive().find(SocialSecurityInput).length).toEqual(1);
});
