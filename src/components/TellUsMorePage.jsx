import React, { Fragment } from 'react';
import Grid from '@material-ui/core/Grid';
import { Formik } from 'formik';
import * as Yup from 'yup';

import FormTextInput from 'components/common/FormTextInput/FormTextInput';
import { H1, SpacedH3 } from 'assets/styles';
import ActionButton from 'components/common/ActionButton/ActionButton';

export default class TellUsMore extends React.Component {
    render () {
        return (
            <Fragment>
                <H1>Tell Us A Little More</H1>
                <SpacedH3>Now, by filling out these details below we can screen you more accurately.</SpacedH3>
                <Formik
                    validationSchema={Yup.object().shape({
                        email: Yup.string()
                            .email('Must be a valid Email')
                            .required('Email is required'),
                        password: Yup.string()
                            .min(8, 'Password must be at least 8 characters')
                            .required('Password is required')
                    })}
                    onSubmit={this.onSubmit}
                >
                    {({
                        values,
                        errors,
                        handleChange,
                        submitCount,
                        handleBlur,
                        handleSubmit,
                        isSubmitting
                    }) => (
                        <form onSubmit={handleSubmit} autoComplete="off">
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <FormTextInput
                                        label="Street Address"
                                        name="street_address"
                                        submitted={submitCount > 0}
                                        handleChange={handleChange}
                                        handleBlur={handleBlur}
                                        error={errors.street_address}
                                        value={values.street_address}
                                    />
                                </Grid>
                                <Grid item xs={8}>
                                    <FormTextInput
                                        label="City"
                                        name="city"
                                        submitted={submitCount > 0}
                                        handleChange={handleChange}
                                        handleBlur={handleBlur}
                                        error={errors.city}
                                        value={values.city}
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <FormTextInput
                                        label="State"
                                        name="state"
                                        submitted={submitCount > 0}
                                        handleChange={handleChange}
                                        handleBlur={handleBlur}
                                        error={errors.state}
                                        value={values.state}
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <FormTextInput
                                        label="Zip"
                                        name="zip"
                                        submitted={submitCount > 0}
                                        handleChange={handleChange}
                                        handleBlur={handleBlur}
                                        error={errors.zip}
                                        value={values.zip}
                                    />
                                </Grid>
                                <Grid item xs={8}>
                                    <FormTextInput
                                        label="Birthday"
                                        name="birthday"
                                        submitted={submitCount > 0}
                                        handleChange={handleChange}
                                        handleBlur={handleBlur}
                                        error={errors.birthday}
                                        value={values.birthday}
                                    />
                                </Grid>
                            </Grid>
                        </form>
                    )}
                </Formik>
                <ActionButton disabled>Continue</ActionButton>
            </Fragment>
        )
    }
}