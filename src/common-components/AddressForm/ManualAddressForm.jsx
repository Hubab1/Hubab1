import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@material-ui/core';
import { TextField } from 'formik-material-ui';
import { Formik, Form, Field } from 'formik';

import { allValuesSet } from 'utils/formik';
import ActionButton from 'common-components/ActionButton/ActionButton';
import GenericFormMessage from 'common-components/GenericFormMessage/GenericFormMessage';

export const ManualAddressForm = ({ initialValues, errors, validationSchema, onSubmit }) => {
    return (
        <Formik validationSchema={validationSchema} initialValues={initialValues} onSubmit={onSubmit}>
            {({ values, isSubmitting }) => {
                return (
                    <Form autoComplete="off">
                        <Grid container spacing={1}>
                            <Grid item xs={9}>
                                <Field
                                    fullWidth
                                    margin="normal"
                                    label="Street Address"
                                    name="address_street"
                                    component={TextField}
                                />
                            </Grid>
                            <Grid item xs={3}>
                                <Field
                                    fullWidth
                                    margin="normal"
                                    label="Apt/Ste/Floor"
                                    name="address_line_2"
                                    component={TextField}
                                />
                            </Grid>
                            <Grid item xs={9}>
                                <Field
                                    fullWidth
                                    margin="normal"
                                    label="City"
                                    name="address_city"
                                    component={TextField}
                                />
                            </Grid>
                            <Grid item xs={3}>
                                <Field
                                    fullWidth
                                    margin="normal"
                                    label="State"
                                    name="address_state"
                                    component={TextField}
                                />
                            </Grid>
                            <Grid item xs={3}>
                                <Field
                                    fullWidth
                                    margin="normal"
                                    label="Zip"
                                    name="address_postal_code"
                                    component={TextField}
                                />
                            </Grid>
                        </Grid>

                        <GenericFormMessage type="error" messages={errors} />
                        <ActionButton
                            marginTop={50}
                            disabled={!allValuesSet(values, { exclude: ['address_line_2', 'search'] }) || isSubmitting}
                        >
                            Continue
                        </ActionButton>
                    </Form>
                );
            }}
        </Formik>
    );
};

ManualAddressForm.propTypes = {
    initialValues: PropTypes.object,
    errors: PropTypes.array,
    validationSchema: PropTypes.object.isRequired,
    onSubmit: PropTypes.func.isRequired,
};

export default ManualAddressForm;
