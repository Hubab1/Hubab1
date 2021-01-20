import React from 'react';
import { mount, shallow } from 'enzyme';
import { Field } from 'formik';

import { EmployerAddressForm, validationSchema } from './EmployerAddressForm';
import LocationSearch from 'components/common/LocationSearch/LocationSearch';
import EmployerAutomatedAddressForm from './EmployerAutomatedAddressForm';
import EmployerManualAddressForm from './EmployerManualAddressForm';

describe('validationSchema', () => {
    let formValues = {};

    beforeEach(() => {
        formValues = {
            name: 'Funnel',
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

    it('postal code validation (nullable ok)', () => {
        expect(
            validationSchema.isValidSync({
                ...formValues,
                address_postal_code: null,
            })
        ).toBe(true);
    });

    it('address street validation (nullable ok)', () => {
        expect(
            validationSchema.isValidSync({
                ...formValues,
                address_street: null,
            })
        ).toBe(true);

        expect(
            validationSchema.isValidSync({
                ...formValues,
                address_street: 'street address without number',
            })
        ).toBe(false);

        expect(
            validationSchema.isValidSync({
                ...formValues,
                address_street: '10-15 street name',
            })
        ).toBe(true);

        expect(
            validationSchema.isValidSync({
                ...formValues,
                address_street: '12th street name',
            })
        ).toBe(true);
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
        ).toBe(true);
    });
});

describe('initial values', () => {
    let defaultProps;

    beforeEach(() => {
        defaultProps = {
            applicant: {
                employer: {
                    name: 'Funnel',
                    address_street: '123 Fulton st',
                    address_line_2: '1F',
                    address_city: 'New York',
                    address_state: 'NY',
                    address_postal_code: '10038',
                },
            },
            errors: [],
            onSubmit: jest.fn(),
            showAutomatedAddress: true,
        };
    });

    it('will populate form with address from applicant employer', () => {
        const wrapper = mount(<EmployerAddressForm {...defaultProps} />);
        const addressSearchField = wrapper.find(LocationSearch).at(0);
        const addressLineField = wrapper.find(Field).at(1);

        const expectedAddressLineValue = defaultProps.applicant.employer.address_line_2;
        const expectedAddressSearchValue =
            '' +
            defaultProps.applicant.employer.address_street +
            ', ' +
            defaultProps.applicant.employer.address_city +
            ', ' +
            defaultProps.applicant.employer.address_state +
            ', ' +
            defaultProps.applicant.employer.address_postal_code;

        expect(addressSearchField.html().includes(expectedAddressSearchValue)).toBe(true);
        expect(addressLineField.html().includes(expectedAddressLineValue)).toBe(true);
    });
});

describe('Shows form based on launch darkly flay', () => {
    let defaultProps;

    beforeEach(() => {
        defaultProps = {
            applicant: {
                employer: {
                    name: 'Nestio',
                    address_street: '123 Fulton st',
                    address_line_2: '1F',
                    address_city: 'New York',
                    address_state: 'NY',
                    address_postal_code: '10038',
                },
            },
            errors: [],
            onSubmit: jest.fn(),
            showAutomatedAddress: true,
        };
    });

    it('shows automated address form when flag is enabled', () => {
        const wrapper = shallow(<EmployerAddressForm {...defaultProps} showAutomatedAddress={true} />);

        expect(wrapper.find(EmployerAutomatedAddressForm).length).toBe(1);
        expect(wrapper.find(EmployerManualAddressForm).length).toBe(0);
    });

    it('shows manual address form when flag is disabled', () => {
        const wrapper = shallow(<EmployerAddressForm {...defaultProps} showAutomatedAddress={false} />);

        expect(wrapper.find(EmployerManualAddressForm).length).toBe(1);
        expect(wrapper.find(EmployerAutomatedAddressForm).length).toBe(0);
    });
});
