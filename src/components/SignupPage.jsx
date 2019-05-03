import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';

import { H1, P, formContent } from 'assets/styles';
import FormTextInput from 'components/common/FormTextInput/FormTextInput';
import ActionButton from 'components/common/ActionButton/ActionButton';
import { fetchRenterProfile } from 'reducers/renter-profile';
import { ROUTES } from 'constants.js';
import auth from 'utils/auth';

export class SignupPage extends React.Component {
    auth=auth
    onSubmit = (values, { setSubmitting }) => {
        return auth.register(values).then((res) => {
            auth.setSession(res.token, this.props.basename);
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
                <H1>Start your rental application by creating an account below</H1>
                <Formik
                    validationSchema={Yup.object().shape({
                        first_name: Yup.string().required('First Name is required'),
                        last_name: Yup.string().required('Last Name is required'),
                        phone_number: Yup.string().required('Phone Number is required'),
                        email: Yup.string()
                            .email()
                            .required('Email is required'),
                        password: Yup.string()
                            .min(6, 'Password must be at least 6 characters')
                            .required('Password is required')
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
                        <ActionButton disabled={isSubmitting} marginTop="76px">Create Account</ActionButton>
                        </div>
                        <P className="already-have-account">Already have an account? <Link to={ROUTES.LOGIN}>Sign in here</Link></P>
                    </form>
                )}
                </Formik>
            </Fragment>
        );
    }
}

const mapStateToProps = (state) => ({
    profile: state.renterProfile,
    basename: state.siteConfig.basename
});

const mapDispatchToProps = { fetchRenterProfile };

export default connect(mapStateToProps, mapDispatchToProps)(SignupPage);
