import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import * as Yup from 'yup';

import API from 'app/api';
import { ROUTES } from 'app/constants';
import thumbsUp from 'assets/images/thumbs-up.png';
import { formContent, H1 } from 'assets/styles';
import ActionButton from 'components/common/ActionButton/ActionButton';
import ConfirmationPage from 'components/common/ConfirmationPage/ConfirmationPage';
import FormTextInput from 'components/common/FormTextInput/FormTextInput';
import GenericFormMessage from 'components/common/GenericFormMessage';


export default class ResetPassword extends React.Component {
    state = {
        confirmReset: false, 
        errors: null
    }
    onSubmit = (values, { setSubmitting }) => {
        const token = this.props.history.location.state.token;

        return API.passwordReset(values.password, token).then((res) => {
            if (res.errors) {
                this.setState({errors: res.errors});
            } else {
                this.setState({confirmReset: true})
            }   
            setSubmitting(false);
        }).catch((res) => {
            this.setState({errors: ['There was an error with resetting your password. Please try again.']})
            setSubmitting(false);
        })
    }

    render () {
        if (this.state.confirmReset) {
            return <ConfirmationPage 
                successMessage="Success! Your Password Has Been Reset."
                confirmationImage={thumbsUp}
                buttonClick={() => this.props.history.push(ROUTES.LOGIN)}
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
                            .oneOf([Yup.ref('password')], 'Oops! Passwords do not match.')
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
                                { this.state.errors && <GenericFormMessage type="error" messages={this.state.errors}/> }
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
                                        showValidationText
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
                                        showValidationText
                                    />
                                </div>
                                <ActionButton disabled={isSubmitting} marginTop={31} marginBottom={153}>
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