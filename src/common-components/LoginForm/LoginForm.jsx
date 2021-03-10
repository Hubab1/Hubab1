import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import { Formik } from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';

import { ROUTES } from 'constants/constants';
import ActionButton from 'common-components/ActionButton/ActionButton';
import FormTextInput from 'common-components/FormTextInput/FormTextInput';
import GenericFormMessage from 'common-components/GenericFormMessage/GenericFormMessage';
import { formContent, link } from 'assets/styles';

export function LoginForm({ handleOnSubmit, includeRegister = false, buttonText, formErrors, email }) {
    return (
        <Formik
            validationSchema={Yup.object().shape({
                email: Yup.string().email('Must be a valid Email').required('Email is required'),
                password: Yup.string()
                    .min(8, 'Password must be at least 8 characters')
                    .required('Password is required'),
            })}
            onSubmit={handleOnSubmit}
            initialValues={{ email, password: '' }}
        >
            {({ values, errors, handleChange, submitCount, handleBlur, handleSubmit, isSubmitting }) => (
                <form onSubmit={handleSubmit} autoComplete="off">
                    <div className={formContent}>
                        {!!formErrors && <GenericFormMessage type="error" messages={formErrors} />}
                        <div>
                            <FormTextInput
                                label="Email"
                                name="email"
                                submitted={submitCount > 0}
                                handleChange={handleChange}
                                handleBlur={handleBlur}
                                error={errors.email}
                                value={values.email}
                                disabled={!!email}
                            />
                            <FormTextInput
                                label="Password"
                                type="password"
                                name="password"
                                submitted={submitCount > 0}
                                handleChange={handleChange}
                                handleBlur={handleBlur}
                                error={errors.password}
                                value={values.password}
                                showValidationText
                            />
                        </div>
                        <div></div>
                        <ActionButton disabled={isSubmitting} marginTop={31} marginBottom={50}>
                            {buttonText}
                        </ActionButton>
                        {includeRegister && (
                            <Fragment>
                                <Link to={ROUTES.FORGOT_PASSWORD} className={link}>
                                    Forgot your password?
                                </Link>
                                <br />
                                <Link to={ROUTES.SIGNUP} className={link}>
                                    Need an account?
                                </Link>
                            </Fragment>
                        )}
                    </div>
                </form>
            )}
        </Formik>
    );
}

LoginForm.propTypes = {
    handleOnSubmit: PropTypes.func,
    includeRegister: PropTypes.bool,
    buttonText: PropTypes.string,
    formErrors: PropTypes.array,
    email: PropTypes.string,
};

export default LoginForm;
