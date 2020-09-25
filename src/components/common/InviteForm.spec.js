import React from 'react';
import { mount, shallow } from 'enzyme';
import { Formik } from 'formik';
import { KeyboardDatePicker } from '@material-ui/pickers';
import { FormHelperText } from '@material-ui/core';

import { InviteForm } from './InviteForm';
import ActionButton from 'components/common/ActionButton/ActionButton';
import FormTextInput from 'components/common/FormTextInput/FormTextInput';


let defaultProps;
beforeEach(() => {
    defaultProps = {
        initialValues: {
            last_name: 'Smith',
            first_name: 'John',
            email: 'johnsmithakjsehfbhi@gmail.com',
        },
        onSubmitDependent: jest.fn()
    };
});

describe('sendToPhone is false', () => {
    describe('all form fields filled in', () => {
        it('ActionButton is not disabled', function () {
            const wrapper = shallow(<InviteForm {...defaultProps}/>);
            const contents = wrapper.find(Formik).dive();
            expect(contents.find(ActionButton).prop('disabled')).toBe(false);
        });
    });

    describe('missing form value', () => {
        const initialValues = {
            last_name: 'Smith',
            first_name: '',
            email: 'johnsmithakjsehfbhi@gmail.com',
        };
        it('disabled if form is incomplete', function () {
            const wrapper = shallow(<InviteForm {...defaultProps} initialValues={initialValues} />);
            const contents = wrapper.find(Formik).dive();
            expect(contents.find(ActionButton).prop('disabled')).toBe(true);
        });
    });
});
describe('sendToPhone is true', () => {
    describe('all form fields filled in', () => {
        const initialValues = {
            last_name: 'Smith',
            first_name: 'John',
            phone_number: '555-555-5555',
        };
        it('ActionButton is not disabled', function () {
            const wrapper = shallow(<InviteForm {...defaultProps} initialValues={initialValues} />);
            const contents = wrapper.find(Formik).dive();
            expect(contents.find(ActionButton).prop('disabled')).toBe(false);
        });
    });

    describe('missing form value', () => {
        const initialValues = {
            last_name: 'Smith',
            first_name: 'John',
            phone_number: '',
        };
        it('disabled if form is incomplete', function () {
            const wrapper = shallow(<InviteForm {...defaultProps} initialValues={initialValues} />);
            const contents = wrapper.find(Formik).dive();
            expect(contents.find(ActionButton).prop('disabled')).toBe(true);
        });
    });
});

describe('initialIsDependent is set to null', () => {
    it('no form should be shown', function () {
        const initialValues = {
            last_name: 'Smith',
            first_name: 'John',
            phone_number: '555-555-5555',
        };
        const wrapper = shallow(<InviteForm {...defaultProps} initialValues={initialValues} initialIsDependent={null} />);
        expect(wrapper.find(Formik).exists()).toBe(false);
    });
});
describe('initialIsDependent is set to true', () => {
    it('should render dependent form', function () {
        const initialValues = {
            last_name: 'Smith',
            first_name: 'John',
            birthday: 'sefefe',
        };
        const wrapper = shallow(<InviteForm {...defaultProps} initialValues={initialValues} initialIsDependent={true} />);
        const contents = wrapper.find(Formik).dive();
        expect(contents.find(FormTextInput).length).toEqual(2);
        expect(contents.find(KeyboardDatePicker).length).toEqual(1);
        expect(contents.find(ActionButton).exists()).toBe(true);
    });
});


it('Case is a guarantor', function () {
    const initialValues = {
        last_name: 'Doe',
        first_name: 'John',
        email: 'john.doe@nest.io',
    };
    const wrapper = shallow(
        <InviteForm
            {...defaultProps}
            initialValues={initialValues}
            isGuarantor={true}
        />);
    const contents = wrapper.find(Formik).dive();
    expect(contents.find(FormTextInput).length).toEqual(3); // first_name, last_name and email
    expect(contents.find(KeyboardDatePicker).length).toEqual(0); // no birthday
    expect(contents.find(FormHelperText).length).toEqual(0); // no help test 'Is this person 18 or older?'
    expect(contents.find(ActionButton).exists()).toBe(true);
});
