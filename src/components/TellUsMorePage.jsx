import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { Formik } from 'formik';
import * as Yup from 'yup';
import styled from '@emotion/styled';
import { KeyboardDatePicker } from '@material-ui/pickers';

import { ROUTES } from 'app/constants';
import { serializeDate, parseDateISOString } from 'utils/misc';
import { updateApplicant } from 'reducers/applicant';
import withRelativeRoutes from 'app/withRelativeRoutes';
import FormTextInput from 'components/common/FormTextInput/FormTextInput';
import { H1, SpacedH3 } from 'assets/styles';
import ActionButton from 'components/common/ActionButton/ActionButton';
import sticky from 'assets/images/sticky.png';

const ImageContainer = styled.div`
    margin-top: 31px;
    margin-bottom: 31px;
    img {
        max-height: 105px;
        max-width: 114px;
    }
`

export class TellUsMore extends React.Component {
    onSubmit = (values, { setSubmitting, setErrors }) => {
        const serialized = Object.assign({}, values);
        serialized.birthday = serializeDate(serialized.birthday);
        this.props.updateApplicant(serialized).then((res) => {
            if (res.errors) {
                setErrors(res.errors);
            } else {
                this.props._nextRoute();
            }
            setSubmitting(false);
        });
    }

    initialValues () {
        const applicant = this.props.applicant;
        let birthday = applicant.birthday;
        // dates are tricky... https://stackoverflow.com/questions/33908299/javascript-parse-a-string-to-date-as-local-time-zone
        if (birthday) {
            birthday = parseDateISOString(birthday);
        }
        return {
            address_street: applicant.address_street,
            address_city: applicant.address_city,
            address_state: applicant.address_state,
            address_postal_code: applicant.address_postal_code,
            birthday: birthday
        }
    }

    render () {
        if (!this.props.applicant) return null;
        return (
            <Fragment>
                <H1>Tell Us A Little More</H1>
                <SpacedH3>Now, by filling out these details below we can screen you more accurately.</SpacedH3>
                <ImageContainer>
                    <img src={sticky} alt="sticky note"/>
                </ImageContainer>
                <Formik
                    validationSchema={Yup.object().shape({
                        address_street: Yup.string()
                            .required('required'),
                        address_city: Yup.string()
                            .required('required'),
                        address_state: Yup.string()
                            .required('required'),
                        address_postal_code: Yup.string()
                            .required('required'),
                        birthday: Yup.string()
                            .required('required'),
                    })}
                    initialValues={this.initialValues()}
                    onSubmit={this.onSubmit}
                >
                    {({
                        values,
                        errors,
                        handleChange,
                        submitCount,
                        handleBlur,
                        handleSubmit,
                        setFieldValue,
                        isSubmitting
                    }) => (
                        <form onSubmit={handleSubmit} autoComplete="off">
                            <Grid container spacing={1}>
                                <Grid item xs={12}>
                                    <FormTextInput
                                        label="Street Address"
                                        name="address_street"
                                        submitted={submitCount > 0}
                                        handleChange={handleChange}
                                        handleBlur={handleBlur}
                                        error={errors.address_street}
                                        value={values.address_street}
                                    />
                                </Grid>
                                <Grid item xs={8}>
                                    <FormTextInput
                                        label="City"
                                        name="address_city"
                                        submitted={submitCount > 0}
                                        handleChange={handleChange}
                                        handleBlur={handleBlur}
                                        error={errors.address_city}
                                        value={values.address_city}
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <FormTextInput
                                        label="State"
                                        name="address_state"
                                        submitted={submitCount > 0}
                                        handleChange={handleChange}
                                        handleBlur={handleBlur}
                                        error={errors.address_state}
                                        value={values.address_state}
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <FormTextInput
                                        label="Zip"
                                        name="address_postal_code"
                                        submitted={submitCount > 0}
                                        handleChange={handleChange}
                                        handleBlur={handleBlur}
                                        error={errors.address_postal_code}
                                        value={values.address_postal_code}
                                    />
                                </Grid>
                                <Grid item xs={8}>
                                    <KeyboardDatePicker
                                        id="birthday-picker"
                                        clearable
                                        disableFuture
                                        format="MM/dd/yyyy"
                                        placeholder="mm/dd/yyyy"
                                        label="Birthday"
                                        value={values.birthday || null}
                                        fullWidth
                                        onBlur={handleBlur}
                                        onChange={e => setFieldValue('birthday', e)}
                                        KeyboardButtonProps={{
                                            'aria-label': 'change date',
                                        }}
                                    />
                                </Grid>
                            </Grid>
                            <ActionButton marginTop={50} disabled={!values.address_street || !values.address_city || !values.address_state || !values.address_postal_code || !values.birthday || isSubmitting}>Continue</ActionButton>
                        </form>
                    )}
                </Formik>
            </Fragment>
        )
    }
}

TellUsMore.propTypes = {
    updateApplicant: PropTypes.func.isRequired,
    applicant: PropTypes.object
}

const mapStateToProps = state => ({
    applicant: state.applicant
})

export default connect(mapStateToProps, {updateApplicant})(withRelativeRoutes(TellUsMore, ROUTES.TELL_US_MORE));