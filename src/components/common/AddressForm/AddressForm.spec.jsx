import React from 'react';
import { mount, shallow } from 'enzyme';
import { Field } from 'formik';

import { AddressForm, validationSchema } from 'components/common/AddressForm/AddressForm';
import LocationSearch from 'components/common/LocationSearch/LocationSearch';
import AutomatedAddressForm from './AutomatedAddressForm';
import ManualAddressForm from './ManualAddressForm';

describe('validationSchema', () => {
    let formValues = {};

    beforeEach(() => {
        formValues = {
            address_street: '123 Fulton st',
            address_city: 'New York',
            address_state: 'NY',
            address_postal_code: '10038',
            address_line_2: '',
        };
    });

    it('valid data', () => {
        expect(
            validationSchema.isValidSync({
                ...formValues,
            })
        ).toBe(true);
    });

    it('postal code validation', () => {
        expect(
            validationSchema.isValidSync({
                ...formValues,
                address_postal_code: null,
            })
        ).toBe(false);
    });

    it('address street validation', () => {
        expect(
            validationSchema.isValidSync({
                ...formValues,
                address_street: null,
            })
        ).toBe(false);
    });

    it('city validation', () => {
        expect(
            validationSchema.isValidSync({
                ...formValues,
                address_city: 'INV@LID',
            })
        ).toBe(false);

        expect(
            validationSchema.isValidSync({
                ...formValues,
                address_city: null,
            })
        ).toBe(false);
    });
});

describe('initial values', () => {
    let defaultProps;

    beforeEach(() => {
        defaultProps = {
            applicant: {
                address_street: '123 Fulton st',
                address_line_2: '1F',
                address_city: 'New York',
                address_state: 'NY',
                address_postal_code: '10038',
            },
            errors: [],
            onSubmit: jest.fn(),
            showAutomatedAddress: true,
        };
    });

    it('will populate form with address from applicant', () => {
        const wrapper = mount(<AddressForm {...defaultProps} />);
        const addressSearchField = wrapper.find(LocationSearch).at(0);
        const addressLineField = wrapper.find(Field).at(0);

        const expectedAddressLineValue = defaultProps.applicant.address_line_2;
        const expectedAddressSearchValue =
            '' +
            defaultProps.applicant.address_street +
            ', ' +
            defaultProps.applicant.address_city +
            ', ' +
            defaultProps.applicant.address_state +
            ', ' +
            defaultProps.applicant.address_postal_code;

        expect(addressSearchField.html().includes(expectedAddressSearchValue)).toBe(true);
        expect(addressLineField.html().includes(expectedAddressLineValue)).toBe(true);
    });
});

describe('Shows form based on launch darkly flay', () => {
    let defaultProps;

    beforeEach(() => {
        defaultProps = {
            applicant: {
                address_street: '123 Fulton st',
                address_line_2: '1F',
                address_city: 'New York',
                address_state: 'NY',
                address_postal_code: '10038',
            },
            errors: [],
            onSubmit: jest.fn(),
            showAutomatedAddress: true,
        };
    });

    it('shows automated address form when flag is enabled', () => {
        const wrapper = shallow(<AddressForm {...defaultProps} showAutomatedAddress={true} />);

        expect(wrapper.find(AutomatedAddressForm).length).toBe(1);
        expect(wrapper.find(ManualAddressForm).length).toBe(0);
    });

    it('shows manual address form when flag is disabled', () => {
        const wrapper = shallow(<AddressForm {...defaultProps} showAutomatedAddress={false} />);

        expect(wrapper.find(ManualAddressForm).length).toBe(1);
        expect(wrapper.find(AutomatedAddressForm).length).toBe(0);
    });
});
