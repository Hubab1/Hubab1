import React from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { css } from 'emotion';

import changePassword from 'assets/images/change-password.jpeg';
import { formContent } from 'assets/styles';
import ActionButton from 'components/common/ActionButton/ActionButton';
import FormTextInput from 'components/common/FormTextInput/FormTextInput';
import GenericFormMessage from 'components/common/GenericFormMessage';

const imgSpacing = css`
    margin-top: 20px;
    margin-bottom: 10px;
`;

export function ChangePasswordForm(props) {
    return (
        <Formik
            validationSchema={Yup.object({
                password: Yup.string()
                    .min(8, 'Password must be at least 8 characters')
                    .required('Password is required'),
                password_confirm: Yup.string()
                    .oneOf([Yup.ref('password')], 'Oops! Passwords do not match.')
                    .required('Please confirm password'),
            })}
            onSubmit={props.onSubmit}
        >
            {({ values, errors, touched, handleChange, submitCount, handleBlur, handleSubmit, isSubmitting }) => (
                <form onSubmit={handleSubmit} autoComplete="off">
                    <img className={imgSpacing} src={changePassword} alt="welcome sign" width="101" height="91" />
                    <div className={formContent}>
                        {props.errors && <GenericFormMessage type="error" messages={props.errors} />}
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
                        <ActionButton disabled={isSubmitting} marginTop={80} marginBottom={20}>
                            Save Password
                        </ActionButton>
                    </div>
                </form>
            )}
        </Formik>
    );
}

ChangePasswordForm.propTypes = {
    onSubmit: PropTypes.func,
    errors: PropTypes.array,
};

export default ChangePasswordForm;
