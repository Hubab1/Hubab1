import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import * as Yup from 'yup';

import API from 'app/api';
import { ROUTES } from 'app/constants';
import { formContent, H1 } from 'assets/styles';
import ActionButton from 'components/common/ActionButton/ActionButton';
import ConfirmationPage from 'components/common/ConfirmationPage';
import FormTextInput from 'components/common/FormTextInput/FormTextInput';


export default class ResetPassword extends React.Component {
    state = {confirmReset: false}
    onSubmit = (values, { setSubmitting }) => {
        return API.passwordReset(values.password).then(() => {
            this.setState({confirmReset: true})
            setSubmitting(false);
        }).catch((res) => {
            this.setState({errors: res.errors});
            setSubmitting(false);
        })
    }

    render () {
        if (this.state.confirmReset) {
            return <ConfirmationPage 
                successMessage="Your password has been reset."
                buttonRoute={ROUTES.LOGIN}
                buttonText="Sign in"
            />
        } 
        return (
            <Fragment>
                <H1>
                    Reset Password
                </H1>

                <Formik
                    validationSchema={Yup.object({
                        password: Yup.string().min(8, 'Password must be at least 8 characters')
                            .required('Password is required'),
                        password_confirm: Yup.string()
                            .oneOf([Yup.ref('password')], 'Password must match')
                            .required('Please confirm password')
                    })}

                    onSubmit={this.onSubmit}
                >
                    {({
                        values,
                        errors,
                        touched,
                        handleChange,
                        submitCount,
                        handleBlur,
                        handleSubmit,
                        isSubmitting
                    }) => (
                        <form onSubmit={handleSubmit} autoComplete="off">
                            <div className={formContent}>
                                <div>
                                    <FormTextInput
                                        label="Enter new password"
                                        type="password"
                                        name="password"
                                        submitted={submitCount > 0}
                                        handleChange={handleChange}
                                        handleBlur={handleBlur}
                                        error={errors.password}
                                        touched={touched.password}
                                        value={values.password}
                                        showHelperText
                                    />
                                    <FormTextInput
                                        label="Confirm password"
                                        type="password"
                                        name="password_confirm"
                                        submitted={submitCount > 0}
                                        handleChange={handleChange}
                                        handleBlur={handleBlur}
                                        error={errors.password_confirm}
                                        touched={touched.password_confirm}
                                        value={values.password_confirm}
                                        showHelperText
                                    />
                                </div>
                                <ActionButton disabled={isSubmitting} marginTop="31px" marginBottom="153px">
                                    Reset
                                </ActionButton>
                            </div>
                        </form>
                    )}
                </Formik>
            </Fragment>
        );
    }
}

ResetPassword.propTypes = {
    fetchRenterProfile: PropTypes.func,
    profile: PropTypes.object
}