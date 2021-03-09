import React from 'react';
import { shallow } from 'enzyme';

import withHooksAsync from 'utils/withHooksAsync';
import { AddressPage, GENERIC_ERROR_MESSAGE } from './AddressPage';
import AddressForm from 'common-components/Forms/AddressForm/AddressForm';

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
            showAutomatedAddress: true,
            toggleLoader: jest.fn(),
        };
    });

    it('will call next route after a succesfull attempt to update the applcant', async () => {
        await withHooksAsync(async () => {
            const updateApplicant = jest.fn().mockReturnValue(Promise.resolve({}));
            const _nextRoute = jest.fn();

            const wrapper = shallow(
                <AddressPage {...defaultProps} updateApplicant={updateApplicant} _nextRoute={_nextRoute} />
            );

            const submitHandler = wrapper.find(AddressForm).props().onSubmit;

            const addressData = {
                address_street: defaultProps.applicant.address_street,
                address_city: defaultProps.applicant.address_city,
                address_state: defaultProps.applicant.address_state,
                address_postal_code: defaultProps.applicant.address_postal_code,
                address_line_2: defaultProps.applicant.address_line_2,
            };

            await submitHandler(addressData, {
                setErrors: jest.fn(),
                setSubmitting: jest.fn(),
                toggleLoader: jest.fn(),
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
                <AddressPage {...defaultProps} updateApplicant={updateApplicant} _nextRoute={_nextRoute} />
            );

            const submitHandler = wrapper.find(AddressForm).props().onSubmit;

            const addressData = {
                address_street: defaultProps.applicant.address_street,
                address_city: defaultProps.applicant.address_city,
                address_state: defaultProps.applicant.address_state,
                address_postal_code: defaultProps.applicant.address_postal_code,
                address_line_2: defaultProps.applicant.address_line_2,
            };

            await submitHandler(addressData, {
                setErrors: jest.fn(),
                setSubmitting: jest.fn(),
                toggleLoader: jest.fn(),
            });

            expect(updateApplicant).toBeCalledWith(addressData);
            expect(_nextRoute).not.toBeCalled();
            expect(wrapper.html().includes(GENERIC_ERROR_MESSAGE)).toBe(true);
        });
    });
});
