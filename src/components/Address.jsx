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
import ActionButton from 'components/common/ActionButton/ActionButton';
import LocationSearch from 'components/common/LocationSearch/LocationSearch';
import GenericFormMessage from './common/GenericFormMessage';
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

export const Address = ({ applicant, updateApplicant, _nextRoute }) => {
    const [errors, setErrors] = useState(null);

    const handleSubmit = useCallback(
        async (values, { setErrors: setFormErrors }) => {
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
            }
        },
        [updateApplicant, _nextRoute]
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

    return (
        <>
            <H1>Tell Us A Little More</H1>
            <SpacedH3>Now, by filling out these details below we can screen you more accurately.</SpacedH3>
            <ImageContainer>
                <img src={sticky} alt="sticky note" />
            </ImageContainer>
            <Formik validationSchema={validationSchema} initialValues={initialValues} onSubmit={handleSubmit}>
                {({ values, errors: validationErrors, isSubmitting, setValues, setFieldValue, submitCount }) => {
                    const disableSubmit = !values.search || values.search === '' || isSubmitting;

                    return (
                        <Form autoComplete="off">
                            <LocationSearch
                                fullWidth
                                margin="normal"
                                label="Street address, city, state, zip"
                                name="address_search"
                                value={values.search}
                                validationError={Object.values(validationErrors)?.join(', ')}
                                didSubmit={submitCount > 0}
                                onChange={(search) => setFieldValue('search', search)}
                                onAddressPicked={(address) => {
                                    setValues({
                                        ...values,
                                        search: address.search,
                                        address_street: address.addressStreet,
                                        address_city: address.city,
                                        address_state: address.state,
                                        address_postal_code: address.postalCode,
                                    });
                                }}
                            />
                            <Field
                                fullWidth
                                margin="normal"
                                label="Apt/Ste/Floor"
                                name="address_line_2"
                                component={TextField}
                            />
                            <GenericFormMessage type="error" messages={errors} />
                            <ActionButton marginTop={50} disabled={disableSubmit}>
                                Continue
                            </ActionButton>
                        </Form>
                    );
                }}
            </Formik>
        </>
    );
};

Address.propTypes = {
    updateApplicant: PropTypes.func.isRequired,
    applicant: PropTypes.object,
    _nextRoute: PropTypes.func,
};

const mapStateToProps = (state) => ({
    applicant: state.applicant,
});

const mapActionsToProps = {
    updateApplicant,
};

export default connect(mapStateToProps, mapActionsToProps)(withRelativeRoutes(Address, ROUTES.ADDRESS));
