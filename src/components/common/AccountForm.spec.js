import React from 'react';
import { shallow } from 'enzyme';
import { Formik } from 'formik';
import { KeyboardDatePicker } from '@material-ui/pickers';

import Checkbox from 'components/common/Checkbox';
import AccountForm from 'components/common/AccountForm';
import ActionButton from 'components/common/ActionButton/ActionButton';
import FormTextInput from 'components/common/FormTextInput/FormTextInput';
import { validationSchema } from 'components/common/AccountForm';

let defaultProps;
beforeEach(() => {
    defaultProps = {
        showConsentInput: true,
        configuration: {
            community: {
                company: {
                    name: 'Orchard Co',
                },
            },
        },
        submitText: 'Submit',
        onSubmit: jest.fn(),
        resetPassword: jest.fn(),
        initialValues: {},
    };
});

it('shows checkbox when showConsentInput=true', function () {
    const wrapper = shallow(<AccountForm {...defaultProps} />);
    expect(wrapper.find(Formik).dive().find(Checkbox).length).toBe(1);
});

it('doesnt show consent input when showConsentInput=false', function () {
    const wrapper = shallow(<AccountForm {...defaultProps} showConsentInput={false} />);
    expect(wrapper.find(Formik).dive().find(Checkbox).length).toBe(0);
});

it('ActionButton is disabled when certain fields are missing', function () {
    const wrapper = shallow(
        <AccountForm
            {...defaultProps}
            initialValues={{
                first_name: '',
                last_name: '',
                phone_number: '',
                email: 'slasjkefoi',
                birthday: '1992/02/02',
                password: '123456789',
                sms_opt_in: false,
            }}
        />
    );
    expect(wrapper.find(Formik).dive().find(ActionButton).prop('disabled')).toBe(true);
});

it('ActionButton is not disabled when sms opt in is unchecked', function () {
    const wrapper = shallow(
        <AccountForm
            {...defaultProps}
            initialValues={{
                first_name: 'bob',
                last_name: 'bob',
                phone_number: '1234567891',
                email: 'slasjkefoi',
                birthday: '1992/02/02',
                password: '123456789',
                sms_opt_in: false,
            }}
        />
    );
    expect(wrapper.find(Formik).dive().find(ActionButton).prop('disabled')).toBe(false);
});

it('Should enable TU fields when disableTUFields is false', () => {
    const wrapper = shallow(<AccountForm {...defaultProps} disableTUFields={false} />);
    const firstNameField = wrapper.find(Formik).dive().find(FormTextInput).at(0);
    const lastNameField = wrapper.find(Formik).dive().find(FormTextInput).at(1);
    const dateOfBirthField = wrapper.find(Formik).dive().find(KeyboardDatePicker);

    expect(firstNameField.prop('disabled')).toBe(false);
    expect(lastNameField.prop('disabled')).toBe(false);
    expect(dateOfBirthField.prop('disabled')).toBe(false);
});

it('Should disable TU fields when disableTUFields is true', () => {
    const wrapper = shallow(<AccountForm {...defaultProps} disableTUFields={true} />);
    const firstNameField = wrapper.find(Formik).dive().find(FormTextInput).at(0);
    const lastNameField = wrapper.find(Formik).dive().find(FormTextInput).at(1);
    const dateOfBirthField = wrapper.find(Formik).dive().find(KeyboardDatePicker);

    expect(firstNameField.prop('disabled')).toBe(true);
    expect(lastNameField.prop('disabled')).toBe(true);
    expect(dateOfBirthField.prop('disabled')).toBe(true);
});

describe('validationSchema', () => {
    it('valid schema', () => {
        expect(
            validationSchema(false).isValidSync({
                first_name: 'bobby',
                last_name: 'bobby',
                phone_number: '(312) 434-3423',
                email: 'slasjkefoi@gmail.com',
                birthday: '1992/02/02',
                password: '123456789',
            })
        ).toBe(true);
    });

    it('long first name', () => {
        expect(
            validationSchema(true).isValidSync({
                first_name: 'bobgewvrihveiorthboierthbeorhtbotrhbioerhborthbge',
                last_name: 'bob',
                phone_number: '(312) 434-3423',
                email: 'slasjkefoi@gmail.com',
                birthday: '1992/02/02',
                password: '123456789',
            })
        ).toBe(false);
    });

    it('long last name', () => {
        expect(
            validationSchema(true).isValidSync({
                first_name: 'bob',
                last_name: 'bobgewvrihveiorthboierthbeorhtbotrhbioerhborthbge',
                phone_number: '(312) 434-3423',
                email: 'slasjkefoi@gmail.com',
                birthday: '1992/02/02',
                password: '123456789',
            })
        ).toBe(false);
    });

    it('invalid last name', () => {
        expect(
            validationSchema(true).isValidSync({
                first_name: 'bob',
                last_name: 'invalid123',
                phone_number: '(312) 434-3423',
                email: 'slasjkefoi@gmail.com',
                birthday: '1992/02/02',
                password: '123456789',
            })
        ).toBe(false);
    });

    it('invalid first name', () => {
        expect(
            validationSchema(true).isValidSync({
                first_name: 'bob1111111!',
                last_name: 'bob',
                phone_number: '(312) 434-3423',
                email: 'slasjkefoi@gmail.com',
                birthday: '1992/02/02',
                password: '123456789',
            })
        ).toBe(false);
    });

    it('invalid phone number', () => {
        expect(
            validationSchema(true).isValidSync({
                first_name: 'Bob',
                last_name: 'bob',
                phone_number: '45342345',
                email: 'slasjkefoi@gmail.com',
                birthday: '1992/02/02',
                password: '123456789',
            })
        ).toBe(false);
    });

    it('invalid birthday', () => {
        expect(
            validationSchema(true).isValidSync({
                first_name: 'Bob',
                last_name: 'bob',
                phone_number: '(312) 434-3423',
                email: 'slasjkefoi@gmail.com',
                birthday: '3099/02/02',
                password: '123456789',
            })
        ).toBe(false);
    });

    it('invalid email', () => {
        expect(
            validationSchema(true).isValidSync({
                first_name: 'Bob',
                last_name: 'bob',
                phone_number: '(312) 434-3423',
                email: 'wrong email',
                birthday: '1994/01/01',
                password: '123456789',
            })
        ).toBe(false);
    });

    it('short password', () => {
        expect(
            validationSchema(true).isValidSync({
                first_name: 'Bob',
                last_name: 'bob',
                phone_number: '(312) 434-3423',
                email: 'hello@nest.io',
                birthday: '1994/01/01',
                password: '1234',
            })
        ).toBe(false);
    });
});
