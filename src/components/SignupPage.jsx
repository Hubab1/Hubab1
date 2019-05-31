import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';

import { H1, P, formContent, ErrorDetail } from 'assets/styles';
import FormTextInput from 'components/common/FormTextInput/FormTextInput';
import PhoneNumberInput from 'components/common/PhoneNumberInput';
import ActionButton from 'components/common/ActionButton/ActionButton';
import { getInitialPage } from 'utils/routeNavigation';
import { fetchRenterProfile } from 'reducers/renter-profile';
import { ROUTES } from 'app/constants';
import auth from 'utils/auth';

export class SignupPage extends React.Component {
    state = {errors: null}

    auth=auth
    onSubmit = (values, { setSubmitting }) => {
        const { history } = this.props;
        const hash = this.props.history.location.state && this.props.history.location.state.hash;

        return auth.register(values, this.props.communityId, hash).then((res) => {
            auth.setSession(res.token, this.props.communityId);
            setSubmitting(false);
            this.props.fetchRenterProfile().then((profile) => {
                const initialPage = getInitialPage(profile);
                history.replace(initialPage);
            });
        }).catch((res) => {
            this.setState({errors: res.errors});
            setSubmitting(false);
        });
    }

    render () {
        const initialValues = this.props.history.location.state && this.props.history.location.state.clientValues;
        return (
            <Fragment>
                <H1>Start Your Rental Application by Creating an Account Below</H1>
                <Formik
                    initialValues={initialValues}
                    validationSchema={Yup.object().shape({
                        first_name: Yup.string().required('First Name is required'),
                        last_name: Yup.string().required('Last Name is required'),
                        phone_number: Yup.string()
                            .required('Phone Number is required')
                            .matches(/^\(\d{3}\)\s\d{3}-\d{4}/, 'Must be a valid US phone number'),
                        email: Yup.string()
                            .email()
                            .required('Email is required'),
                        password: Yup.string()
                            .required('Password must be at least 8 characters')
                            .min(8, 'Password must be at least 8 characters')
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
                        touched
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
                                    value={values.first_name}
                                />
                                <FormTextInput
                                    label="Last Name"
                                    name="last_name"
                                    submitted={submitCount > 0}
                                    handleChange={handleChange}
                                    handleBlur={handleBlur}
                                    error={errors.last_name}
                                    value={values.last_name}
                                />
                                <FormTextInput
                                    label="Email"
                                    name="email"
                                    submitted={submitCount > 0}
                                    handleChange={handleChange}
                                    handleBlur={handleBlur}
                                    error={errors.email}
                                    value={values.email}
                                />
                                <PhoneNumberInput 
                                    label="Phone Number"
                                    name="phone_number"
                                    value={values.phone_number}
                                    handleChange={handleChange}
                                    error={submitCount > 0 && !!errors.phone_number}
                                    helperText={submitCount > 0 ? errors.phone_number : null}
                                />
                                <FormTextInput
                                    label="Password"
                                    name="password"
                                    type="password"
                                    submitted={submitCount > 0}
                                    handleChange={handleChange}
                                    handleBlur={handleBlur}
                                    error={errors.password}
                                    value={values.password}
                                    showHelperText
                                    touched={touched && touched.password}
                                />
                                <div>
                                    {!!this.state.errors && <ErrorDetail>{this.state.errors.error}</ErrorDetail>}
                                </div>
                                <ActionButton disabled={isSubmitting} marginTop="76px" marginBottom="20px">Create Account</ActionButton>
                            </div>
                            <P className="already-have-account">Already have an account? <Link to={ROUTES.LOGIN}>Sign in here</Link></P>
                        </form>
                    )}
                </Formik>
            </Fragment>
        );
    }
}

SignupPage.propTypes = {
    profile: PropTypes.object,
    fetchRenterProfile: PropTypes.func
}

const mapStateToProps = (state) => ({
    profile: state.renterProfile,
    communityId: state.siteConfig.basename,
});

const mapDispatchToProps = { fetchRenterProfile };

export default connect(mapStateToProps, mapDispatchToProps)(SignupPage);
