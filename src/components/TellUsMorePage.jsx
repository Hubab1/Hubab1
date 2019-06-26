import React, { Fragment } from 'react';
import Grid from '@material-ui/core/Grid';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { ROUTES } from 'app/constants';
import withRelativeRoutes from 'app/withRelativeRoutes';
import FormTextInput from 'components/common/FormTextInput/FormTextInput';
import { H1, SpacedH3 } from 'assets/styles';
import ActionButton from 'components/common/ActionButton/ActionButton';

export class TellUsMore extends React.Component {
    onSubmit = (values, { setSubmitting }) => {
        Promise.resolve().then(() => {
            // this.props._nextRoute();
            setSubmitting(false);
        })
    }

    render () {
        return (
            <Fragment>
                <H1>Tell Us A Little More</H1>
                <SpacedH3>Now, by filling out these details below we can screen you more accurately.</SpacedH3>
                <Formik
                    validationSchema={Yup.object().shape({
                        street_address: Yup.string()
                            .required('required'),
                        city: Yup.string()
                            .required('required'),
                        state: Yup.string()
                            .required('required'),
                        zip: Yup.string()
                            .required('required'),
                        birthday: Yup.string()
                            .required('required'),
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
                                        type="date"
                                        submitted={submitCount > 0}
                                        handleChange={handleChange}
                                        handleBlur={handleBlur}
                                        error={errors.birthday}
                                        value={values.birthday}
                                    />
                                </Grid>
                            </Grid>
                            <ActionButton disabled={!values.street_address || !values.city || !values.state || !values.zip || !values.birthday || isSubmitting}>Continue</ActionButton>
                        </form>
                    )}
                </Formik>
            </Fragment>
        )
    }
}

export default withRelativeRoutes(TellUsMore, ROUTES.TELL_US_MORE);