import React from 'react';
import PropTypes from 'prop-types';
import { TextField } from 'formik-material-ui';
import { Formik, Form, Field } from 'formik';

import ActionButton from 'components/ActionButton/ActionButton';
import LocationSearch from 'components/LocationSearch/LocationSearch';
import GenericFormMessage from 'components/GenericFormMessage/GenericFormMessage';

export const AutomatedAddressForm = ({ initialValues, errors, validationSchema, onSubmit }) => {
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
                const disableSubmit = !values.search || values.search === '' || isSubmitting;

                return (
                    <Form autoComplete="off">
                        <LocationSearch
                            fullWidth
                            margin="normal"
                            label="Street address, city, state, zip"
                            name="address_search"
                            value={values.search}
                            initialValue={initialValues.search}
                            validationError={Object.values(validationErrors)?.join(', ')}
                            submitCount={submitCount}
                            onChange={(search) => setFieldValue('search', search)}
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
    );
};

AutomatedAddressForm.propTypes = {
    initialValues: PropTypes.object,
    errors: PropTypes.array,
    validationSchema: PropTypes.object.isRequired,
    onSubmit: PropTypes.func.isRequired,
};

export default AutomatedAddressForm;
