import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Formik } from 'formik';
import FormTextInput from 'components/common/FormTextInput';
import ActionButton from 'components/common/ActionButton';
import * as Yup from 'yup';

import { SubtitleTwo, loginContent } from 'assets/emotion/styles';

import { fetchRenterProfile } from 'reducers/renter-profile';
import { initializePage } from 'utils/initializePage';

import auth from 'utils/auth';

export class SignupPage extends React.Component {
    auth=auth
    onSubmit = (values, { setSubmitting }) => {
        return auth.register(values).then((res) => {
            auth.setSession(res.token);
            setSubmitting(false);
            this.props.fetchRenterProfile().then(
                initializePage(this.props.profile)
            );
        }).catch((res) => {
            this.setState({errors: res.errors});
            setSubmitting(false);
        });
    }

    render () {
        return (
            <Fragment>
                <SubtitleTwo>To get started on your rental application, create an account below</SubtitleTwo>
                <Formik
                    initialValues={{ password: '' }}
                    validationSchema={Yup.object().shape({
                        first_name: Yup.string().required(),
                        last_name: Yup.string().required(),
                        phone_number: Yup.string().required(),
                        email: Yup.string()
                          .email()
                          .required('Required'),
                        password: Yup.string()
                            .min(6)
                            .required()
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
                    isSubmitting,
                    /* and other goodies */
                }) => (
                    <form onSubmit={handleSubmit} autoComplete="off">
                        <div className={loginContent}>
                            <FormTextInput
                                label="First Name"
                                name="first_name"
                                submitted={submitCount > 0}
                                handleChange={handleChange}
                                handleBlur={handleBlur}
                                error={errors.first_name}
                                touched={touched.first_name}
                                value={values.first_name}
                            />
                            <FormTextInput
                                label="Last Name"
                                name="last_name"
                                submitted={submitCount > 0}
                                handleChange={handleChange}
                                handleBlur={handleBlur}
                                error={errors.last_name}
                                touched={touched.last_name}
                                value={values.last_name}
                            />
                            <FormTextInput
                                label="Email"
                                name="email"
                                submitted={submitCount > 0}
                                handleChange={handleChange}
                                handleBlur={handleBlur}
                                error={errors.email}
                                touched={touched.email}
                                value={values.email}
                            />
                            <FormTextInput
                                label="Phone Number"
                                name="phone_number"
                                submitted={submitCount > 0}
                                handleChange={handleChange}
                                handleBlur={handleBlur}
                                error={errors.phone_number}
                                touched={touched.phone_number}
                                value={values.phone_number}
                            />
                            <FormTextInput
                                label="Password"
                                name="password"
                                type="password"
                                submitted={submitCount > 0}
                                handleChange={handleChange}
                                handleBlur={handleBlur}
                                error={errors.password}
                                touched={touched.password}
                                value={values.password}
                            />
                            <ActionButton disabled={isSubmitting}>Create Account</ActionButton>
                        </div>
                        {/* eslint-disable-next-line */}
                        <div className="already-have-account">Already have an account? Sign in <a href="#">here</a></div>
                    </form>
                )}
                </Formik>
            </Fragment>
        );
    }
}

const mapStateToProps = (state) => ({
    profile: state.renterProfile,
});

const mapDispatchToProps = { fetchRenterProfile };

export default connect(mapStateToProps, mapDispatchToProps)(SignupPage);
