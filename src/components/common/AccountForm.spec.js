import React from 'react';
import { shallow, mount } from 'enzyme';
import { Formik } from 'formik';

import Checkbox from 'components/common/Checkbox';
import AccountForm from 'components/common/AccountForm';
import ActionButton from 'components/common/ActionButton/ActionButton';

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

it('ActionButton is disabled when certain fields are missing', function () {
    let wrapper = shallow(<AccountForm {...defaultProps} initialValues={{
        first_name: '',
        last_name: '',
        phone_number: '',
        email: 'slasjkefoi',
        birthday: '1992/02/02',
        password: '123456789',
        sms_opt_in: false
    }}/>);
    // console.log(wrapper.find(Formik).dive().debug())
    expect(wrapper.find(Formik).dive().find(ActionButton).prop('disabled')).toBe(true);
});

it('ActionButton is not disabled when sms opt in is unchecked', function () {
    let wrapper = shallow(<AccountForm {...defaultProps} initialValues={{
        first_name: 'bob',
        last_name: 'bob',
        phone_number: '1234567891',
        email: 'slasjkefoi',
        birthday: '1992/02/02',
        password: '123456789',
        sms_opt_in: false
    }}/>);
    // console.log(wrapper.find(Formik).dive().debug())
    expect(wrapper.find(Formik).dive().find(ActionButton).prop('disabled')).toBe(false);
});
