import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';

import EmployerAutomatedAddressForm from './EmployerAutomatedAddressForm';
import EmployerManualAddressForm from './EmployerManualAddressForm';

export const validationSchema = Yup.object().shape({
    name: Yup.string().nullable(),
    search: Yup.string().nullable(),
    address_street: Yup.string()
        .matches(/^[0-9-]/, 'Street address must start with a number')
        .nullable(),
    address_city: Yup.string()
        .matches(/^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{1,}$/, 'Invalid city')
        .nullable(),
    address_state: Yup.string().nullable(),
    address_postal_code: Yup.string().nullable(),
    address_line_2: Yup.string().nullable(),
});

export const EmployerAddressForm = ({ applicant, showAutomatedAddress, errors, onSubmit }) => {
    const initialValues = useMemo(() => {
        const searchBuilder = [];
        const employer = applicant.employer;
        if (employer?.address_street) searchBuilder.push(employer?.address_street);
        if (employer?.address_city) searchBuilder.push(employer?.address_city);
        if (employer?.address_state) searchBuilder.push(employer?.address_state);
        if (employer?.address_postal_code) searchBuilder.push(employer?.address_postal_code);
        const search = searchBuilder.join(', ');

        return {
            search,
            name: employer?.name || '',
            address_street: employer?.address_street || '',
            address_city: employer?.address_city || '',
            address_state: employer?.address_state || '',
            address_postal_code: employer?.address_postal_code || '',
            address_line_2: employer?.address_line_2 || '',
        };
    }, [applicant]);

    if (!applicant) {
        return null;
    }

    const FormComponent = showAutomatedAddress ? EmployerAutomatedAddressForm : EmployerManualAddressForm;

    return (
        <FormComponent
            validationSchema={validationSchema}
            initialValues={initialValues}
            errors={errors}
            onSubmit={onSubmit}
        />
    );
};

EmployerAddressForm.propTypes = {
    applicant: PropTypes.object,
    errors: PropTypes.array,
    showAutomatedAddress: PropTypes.bool,
    onSubmit: PropTypes.func.isRequired,
};

export default EmployerAddressForm;
