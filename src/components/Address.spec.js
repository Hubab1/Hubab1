import React from 'react';
import { mount, shallow } from 'enzyme';
import { Formik, Field } from 'formik';

import withHooksAsync from 'utils/withHooksAsync';
import { Address, validationSchema, GENERIC_ERROR_MESSAGE } from './Address';

describe('validationSchema', () => {
    let formValues = {};

    beforeEach(() => {
        formValues = {
            address_search: {
                address_street: '123 Fulton st',
                address_city: 'New York',
                address_state: 'NY',
                address_postal_code: '10038',
            },
            address_line_2: ''
        };
    });

    it('valid data', () => {
        expect(validationSchema.isValidSync({
            ...formValues
        })).toBe(true);
    });

    it('postal code validation', () => {
        expect(validationSchema.isValidSync({
            ...formValues,
            address_search: {
                ...formValues.address_search,
                address_postal_code: 'INVALID'
            }
        })).toBe(false);

        expect(validationSchema.isValidSync({
            ...formValues,
            address_search: {
                ...formValues.address_search,
                address_postal_code: null
            }
        })).toBe(false);
    });

    it('address street validation', () => {
        expect(validationSchema.isValidSync({
            ...formValues,
            address_search: {
                ...formValues.address_search,
                address_street: 'INV@LID'
            }
        })).toBe(false);

        expect(validationSchema.isValidSync({
            ...formValues,
            address_search: {
                ...formValues.address_search,
                address_street: null
            }
        })).toBe(false);
    });

    it('city validation', () => {
        expect(validationSchema.isValidSync({
            ...formValues,
            address_search: {
                ...formValues.address_search,
                address_city: 'INV@LID'
            }
        })).toBe(false);

        expect(validationSchema.isValidSync({
            ...formValues,
            address_search: {
                ...formValues.address_search,
                address_city: null
            }
        })).toBe(false);
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
            updateApplicant: jest.fn()
        };
    });

    it('will populate form with address from applicant', () => {
        const wrapper = mount(<Address {...defaultProps} />);
        const addressSearchField = wrapper.find(Field).at(0);
        const addressLineField = wrapper.find(Field).at(1);

        const expectedAddressLineValue = defaultProps.applicant.address_line_2;
        const expectedAddressSearchValue = '' +
            defaultProps.applicant.address_street + ', ' +
            defaultProps.applicant.address_city + ', ' +
            defaultProps.applicant.address_state + ', ' +
            defaultProps.applicant.address_postal_code;

        expect(addressSearchField.html().includes(expectedAddressSearchValue)).toBe(true);
        expect(addressLineField.html().includes(expectedAddressLineValue)).toBe(true);
    });
});

describe('handle submit', () => {
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
        };
    });

    it('will call next route after a succesfull attempt to update the applcant', async () => {
        await withHooksAsync(async () => {
            const updateApplicant = jest.fn().mockReturnValue(Promise.resolve({}));
            const _nextRoute = jest.fn();

            const wrapper = shallow(
                <Address
                    {...defaultProps}
                    updateApplicant={updateApplicant}
                    _nextRoute={_nextRoute}
                />
            );

            const submitHandler = wrapper.find(Formik).props().onSubmit;

            const addressData  = {
                address_street: defaultProps.applicant.address_street,
                address_city: defaultProps.applicant.address_city,
                address_state: defaultProps.applicant.address_state,
                address_postal_code: defaultProps.applicant.address_postal_code,
                address_line_2: defaultProps.applicant.address_line_2
            };

            await submitHandler({
                address_search: {
                    ...addressData
                },
                address_line_2: addressData.address_line_2
            }, {
                setSubmitting: jest.fn(),
                setErrors: jest.fn(),
            });

            expect(updateApplicant).toBeCalledWith(addressData);
            expect(_nextRoute).toBeCalled();
        });
    });

    it('will show error after a failed attempt to update the applcant', async () => {
        await withHooksAsync(async () => {
            const updateApplicant = jest.fn().mockReturnValue(Promise.reject({}));
            const _nextRoute = jest.fn();

            const wrapper = shallow(
                <Address
                    {...defaultProps}
                    updateApplicant={updateApplicant}
                    _nextRoute={_nextRoute}
                />
            );

            const submitHandler = wrapper.find(Formik).props().onSubmit;

            const addressData  = {
                address_street: defaultProps.applicant.address_street,
                address_city: defaultProps.applicant.address_city,
                address_state: defaultProps.applicant.address_state,
                address_postal_code: defaultProps.applicant.address_postal_code,
                address_line_2: defaultProps.applicant.address_line_2
            };

            await submitHandler({
                address_search: {
                    ...addressData
                },
                address_line_2: addressData.address_line_2
            }, {
                setSubmitting: jest.fn(),
                setErrors: jest.fn(),
            });

            expect(updateApplicant).toBeCalledWith(addressData);
            expect(_nextRoute).not.toBeCalled();

            expect(wrapper.html().includes(GENERIC_ERROR_MESSAGE)).toBe(true);
        });
    });
});
