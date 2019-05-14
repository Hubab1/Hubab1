import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import * as Yup from 'yup';

import FormTextInput from 'components/common/FormTextInput/FormTextInput';
import ActionButton from 'components/common/ActionButton/ActionButton';
import { formContent, H1 } from 'assets/styles';
import auth from 'utils/auth';


export default class ResetPassword extends React.Component {
    auth=auth
    onSubmit = (values, { setSubmitting }) => {
        return auth.login(values.username, values.password).then((res) => {
            auth.setSession(res.token, this.props.communityId);
            setSubmitting(false);
            this.props.fetchRenterProfile();
        }).catch((res) => {
            this.setState({errors: res.errors});
            setSubmitting(false);
        });
    }

    render () {
        return (
            <Fragment>
                <H1>
                    Reset Password
                </H1>

                <Formik
                    validationSchema={Yup.object({
                        password: Yup.string().required('Password is required'),
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