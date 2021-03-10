import React from 'react';
import PropTypes from 'prop-types';
import { TextField } from 'formik-material-ui';
import { Formik, Form, Field } from 'formik';

import ActionButton from 'common-components/ActionButton/ActionButton';
import LocationSearch from 'common-components/LocationSearch/LocationSearch';
import GenericFormMessage from 'common-components/GenericFormMessage/GenericFormMessage';

export const EmployerAutomatedAddressForm = ({ initialValues, errors, validationSchema, onSubmit }) => {
    return (
        <Formik
            validationSchema={validationSchema}
            initialValues={initialValues}
            onSubmit={onSubmit}
            validateOnBlur={false}
            validateOnChange={false}
        >
            {({
                values,
                errors: validationErrors,
                isSubmitting,
                setValues,
                setFieldValue,
                submitCount,
                setErrors,
                validateForm,
            }) => {
                return (
                    <Form autoComplete="none">
                        <Field
                            fullWidth
                            margin="normal"
                            label="Employer/Company name (optional)"
                            name="name"
                            component={TextField}
                            autoComplete="none"
                        />
                        <LocationSearch
                            fullWidth
                            margin="normal"
                            label="Street address, city, state, zip (optional)"
                            name="address_search"
                            autoComplete="none"
                            value={values.search}
                            initialValues={initialValues}
                            validationError={Object.values(validationErrors)?.join(', ')}
                            submitCount={submitCount}
                            onChange={(search) => {
                                setFieldValue('search', search || '');

                                if (search === '') {
                                    setFieldValue('address_street', '');
                                    setFieldValue('address_city', '');
                                    setFieldValue('address_state', '');
                                    setFieldValue('address_postal_code', '');
                                }
                            }}
                            resetValidationErrors={() => setErrors({})}
                            onAddressPicked={(address) => {
                                setValues({
                                    ...values,
                                    search: address.search,
                                    address_street: address.addressStreet,
                                    address_city: address.city,
                                    address_state: address.state,
                                    address_postal_code: address.postalCode,
                                });

                                validateForm();
                            }}
                        />
                        <Field
                            fullWidth
                            margin="normal"
                            label="Apt/Ste/Floor (optional)"
                            name="address_line_2"
                            component={TextField}
                            autoComplete="none"
                        />
                        <GenericFormMessage type="error" messages={errors} />
                        <ActionButton marginTop={50} marginBottom={20} disabled={isSubmitting}>
                            Continue
                        </ActionButton>
                    </Form>
                );
            }}
        </Formik>
    );
};

EmployerAutomatedAddressForm.propTypes = {
    initialValues: PropTypes.object,
    errors: PropTypes.array,
    validationSchema: PropTypes.object.isRequired,
    onSubmit: PropTypes.func.isRequired,
    formRequired: PropTypes.bool,
};

export default EmployerAutomatedAddressForm;
