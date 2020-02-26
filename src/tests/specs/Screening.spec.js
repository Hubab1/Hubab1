import React from 'react';
import { shallow } from 'enzyme';

import {Screening} from "components/Screening";
import {Formik} from "formik";

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

it('Display SSN field when have ssn', function() {
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
    wrapper.setState({ haveSocialSecurityNumber: true });
    const form = wrapper.find(Formik);
    expect(form.html()).toMatch(/Social Security Number/);
});

it('Not displaying SSN field when does not have ssn', function() {
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
    wrapper.setState({ haveSocialSecurityNumber: false });
    const form = wrapper.find(Formik);
    expect(form.html()).not.toMatch(/Social Security Number/);
});