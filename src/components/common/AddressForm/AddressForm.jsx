import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';

import AutomatedAddressForm from 'components/common/AddressForm/AutomatedAddressForm';
import ManualAddressForm from 'components/common/AddressForm/ManualAddressForm';

export const validationSchema = Yup.object().shape({
    search: Yup.string(),
    address_street: Yup.string()
        .required('Street is required')
        .matches(/^[A-Za-z0-9\-]+(?:\s[A-Za-z0-9'_-]+)+$/, 'Invalid street'),
    address_city: Yup.string()
        .required('City is required')
        .matches(/^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{1,}$/, 'Invalid city'),
    address_state: Yup.string().required('State is required'),
    address_postal_code: Yup.string().required('Zip code is required'),
    address_line_2: Yup.string(),
});

export const AddressForm = ({ applicant, showAutomatedAddress, errors, onSubmit }) => {
    const initialValues = useMemo(() => {
        const searchBuilder = [];
        if (applicant.address_street) searchBuilder.push(applicant.address_street);
        if (applicant.address_city) searchBuilder.push(applicant.address_city);
        if (applicant.address_state) searchBuilder.push(applicant.address_state);
        if (applicant.address_postal_code) searchBuilder.push(applicant.address_postal_code);
        const search = searchBuilder.join(', ');

        return {
            search,
            address_street: applicant.address_street,
            address_city: applicant.address_city,
            address_state: applicant.address_state,
            address_postal_code: applicant.address_postal_code,
            address_line_2: applicant.address_line_2,
        };
    }, [applicant]);

    if (!applicant) {
        return null;
    }

    const FormComponent = showAutomatedAddress ? AutomatedAddressForm : ManualAddressForm;

    return (
        <FormComponent
            validationSchema={validationSchema}
            initialValues={initialValues}
            errors={errors}
            onSubmit={onSubmit}
        />
    );
};

AddressForm.propTypes = {
    applicant: PropTypes.object,
    errors: PropTypes.array,
    showAutomatedAddress: PropTypes.bool,
    onSubmit: PropTypes.func.isRequired,
};

export default AddressForm;
