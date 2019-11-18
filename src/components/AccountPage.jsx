import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Grid from '@material-ui/core/Grid';
import { KeyboardDatePicker } from '@material-ui/pickers';

import { updateApplicant } from 'reducers/applicant';
import captureRoute from 'app/captureRoute';
import { H1, formContent } from 'assets/styles';
import FormTextInput from 'components/common/FormTextInput/FormTextInput';
import PhoneNumberInput from 'components/common/PhoneNumberInput';
import GenericFormError from 'components/common/GenericFormError';
import ActionButton from 'components/common/ActionButton/ActionButton';
import { ROUTES } from 'app/constants';
import { allValuesSet } from 'utils/formik';
import { serializeDate, parseDateISOString } from 'utils/misc';	


export class AccountPage extends React.Component {
    state = {errors: null}

    get initialValues () {
        const applicant = this.props.applicant;
        let birthday = applicant.birthday;
        if (birthday) {
            birthday = parseDateISOString(birthday);
        }
        return {
            first_name: applicant.first_name,
            last_name: applicant.last_name,
            phone_number: applicant.phone_number,
            email: applicant.email,
            birthday
        }
    }

    onSubmit = (values, { setSubmitting, setErrors }) => {
        const stateUpdate = Object.assign({}, values);
        stateUpdate.birthday = serializeDate(stateUpdate.birthday);
        this.props.updateApplicant(stateUpdate, stateUpdate).then((res) => {
            if (res.errors) {
                setErrors(res.errors);
            } else {
                
            }
            setSubmitting(false);
        });
    }

    render () {
        return (
            <>
                <H1>Your Account Details</H1>
                <Formik
                    initialValues={this.initialValues}
                    validationSchema={Yup.object().shape({
                        first_name: Yup.string().required('First Name is required'),
                        last_name: Yup.string().required('Last Name is required'),
                        phone_number: Yup.string()
                            .required('Phone Number is required')
                            .matches(/^\(\d{3}\)\s\d{3}-\d{4}/, 'Must be a valid US phone number'),
                        email: Yup.string()
                            .email()
                            .required('Email is required'),
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
                        isSubmitting,
                        touched,
                        setFieldValue,
                    }) => (
                        <form onSubmit={handleSubmit} autoComplete="off">
                            <div className={formContent}>
                                { this.state.errors && <GenericFormError errors={this.state.errors}/> }
                                <Grid container spacing={1}>
                                    <Grid item xs={12}>
                                        <FormTextInput
                                            label="First Name"
                                            name="first_name"
                                            submitted={submitCount > 0}
                                            handleChange={handleChange}
                                            handleBlur={handleBlur}
                                            error={errors.first_name}
                                            value={values.first_name}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <FormTextInput
                                            label="Last Name"
                                            name="last_name"
                                            submitted={submitCount > 0}
                                            handleChange={handleChange}
                                            handleBlur={handleBlur}
                                            error={errors.last_name}
                                            value={values.last_name}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <FormTextInput
                                            label="Email"
                                            name="email"
                                            submitted={submitCount > 0}
                                            handleChange={handleChange}
                                            handleBlur={handleBlur}
                                            error={errors.email}
                                            value={values.email}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <PhoneNumberInput 
                                            label="Phone Number"
                                            name="phone_number"
                                            value={values.phone_number}
                                            handleChange={handleChange}
                                            error={submitCount > 0 && !!errors.phone_number}
                                            helperText={submitCount > 0 ? errors.phone_number : null}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
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
                                <ActionButton disabled={!allValuesSet(values) || isSubmitting} marginTop={20} marginBottom={20}>Save Changes</ActionButton>
                            </div>
                        </form>
                    )}
                </Formik>
            </>
        );
    }
}

AccountPage.propTypes = {
    updateApplicant: PropTypes.func,
}

const mapStateToProps = (state) => ({
    applicant: state.applicant,
});

const mapDispatchToProps = { updateApplicant };

export default connect(mapStateToProps, mapDispatchToProps)(captureRoute(AccountPage, ROUTES.ACCOUNT));
