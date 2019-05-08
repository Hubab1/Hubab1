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
                        password_1: Yup.string().required('Password is required'),
                        password_2: Yup.string()
                            .oneOf([Yup.ref('password_1')], 'Password must match')
                            .required('Password confirm is required')
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
                                        name="password_1"
                                        submitted={submitCount > 0}
                                        handleChange={handleChange}
                                        handleBlur={handleBlur}
                                        error={errors.password_1}
                                        touched={touched.password_1}
                                        value={values.password_1}
                                    />
                                    <FormTextInput
                                        label="Confirm password"
                                        type="password"
                                        name="password_2"
                                        submitted={submitCount > 0}
                                        handleChange={handleChange}
                                        handleBlur={handleBlur}
                                        error={errors.password_2}
                                        touched={touched.password_2}
                                        value={values.password_2}
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