import React from 'react';
import { shallow } from 'enzyme';
import { Formik } from 'formik';

import Checkbox from 'components/common/Checkbox';
import AccountForm from 'components/common/AccountForm';


let defaultProps;
beforeEach(() => {
    defaultProps = {
        showConsentInput: true
    }
});

it('shows checkbox when showConsentInput=true', function () {
    let wrapper = shallow(<AccountForm {...defaultProps}/>);
    expect(wrapper.find(Formik).dive().find(Checkbox).length).toBe(1);
});

it('doesnt show consent input when showConsentInput=false', function () {
    let wrapper = shallow(<AccountForm {...defaultProps} showConsentInput={false}/>);
    expect(wrapper.find(Formik).dive().find(Checkbox).length).toBe(0);
});
