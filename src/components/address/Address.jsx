import React, { useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { TextField } from 'formik-material-ui';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import styled from '@emotion/styled';

import { ROUTES } from 'app/constants';
import { updateApplicant } from 'reducers/applicant';
import withRelativeRoutes from 'app/withRelativeRoutes';
import AutomatedAddressForm from './AutomatedAddressForm';
import ManualAddressForm from './ManualAddressForm';
import { H1, SpacedH3 } from 'assets/styles';
import sticky from 'assets/images/sticky.png';

const ImageContainer = styled.div`
    margin-top: 31px;
    margin-bottom: 31px;
    img {
        max-height: 105px;
        max-width: 114px;
    }
`;

export const GENERIC_ERROR_MESSAGE = 'Oops! We ran into some issues. Please try again later.';

export const validationSchema = Yup.object().shape({
    search: Yup.string(),
    address_street: Yup.string().required('Street is required'),
    address_city: Yup.string()
        .required('City is required')
        .matches(/^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{1,}$/, 'Invalid city'),
    address_state: Yup.string().required('State is required'),
    address_postal_code: Yup.string().required('Zip code is required'),
    address_line_2: Yup.string(),
});

export const Address = ({ applicant, showAutomatedAddress, updateApplicant, _nextRoute }) => {
    const [errors, setErrors] = useState(null);

    const handleSubmit = useCallback(
        async (values, { setErrors: setFormErrors, setSubmitting }) => {
            setErrors(null);

            try {
                const response = await updateApplicant(values);
                if (response.errors) {
                    setFormErrors(response.errors);
                } else {
                    _nextRoute();
                }
            } catch {
                setErrors([GENERIC_ERROR_MESSAGE]);
            } finally {
                setSubmitting(false);
            }
        },
        [updateApplicant, _nextRoute, setErrors]
    );

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

    const AddressForm = showAutomatedAddress ? AutomatedAddressForm : ManualAddressForm;

    return (
        <>
            <H1>Tell Us A Little More</H1>
            <SpacedH3>Now, by filling out these details below we can screen you more accurately.</SpacedH3>
            <ImageContainer>
                <img src={sticky} alt="sticky note" />
            </ImageContainer>
            <AddressForm validationSchema={validationSchema} initialValues={initialValues} onSubmit={handleSubmit} />
        </>
    );
};

Address.propTypes = {
    applicant: PropTypes.object,
    showAutomatedAddress: PropTypes.bool,
    updateApplicant: PropTypes.func.isRequired,
    _nextRoute: PropTypes.func,
};

const mapStateToProps = (state) => ({
    applicant: state.applicant,
    showAutomatedAddress: getShowAutomatedAddressForm(state),
});

const mapActionsToProps = {
    updateApplicant,
};

export default connect(mapStateToProps, mapActionsToProps)(withRelativeRoutes(Address, ROUTES.ADDRESS));
