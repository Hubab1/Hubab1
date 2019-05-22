import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';

import { H1, P, formContent, ErrorDetail } from 'assets/styles';
import FormTextInput from 'components/common/FormTextInput/FormTextInput';
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

        //reset phone_1 field to phone_number for backend
        // eslint-disable-next-line
        delete Object.assign(values, {['phone_number']: values['phone_1'] })['phone_1'];

        return auth.register(values, this.props.communityId, this.props.hash).then((res) => {
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
        return (
            <Fragment>
                <H1>Start your rental application by creating an account below</H1>
                <Formik
                    initialValues={this.props.history.location.state}
                    validationSchema={Yup.object().shape({
                        first_name: Yup.string().required('First Name is required'),
                        last_name: Yup.string().required('Last Name is required'),
                        phone_1: Yup.string().required('Phone Number is required'),
                        email: Yup.string()
                            .email()
                            .required('Email is required'),
                        password: Yup.string()
                            .min(8, 'Password must be at least 8 characters')
                            .required('Password is required')
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
                                <FormTextInput
                                    label="Phone Number"
                                    name="phone_1"
                                    submitted={submitCount > 0}
                                    handleChange={handleChange}
                                    handleBlur={handleBlur}
                                    error={errors.phone_1}
                                    value={values.phone_1}
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
                                />
                                <div>
                                    {!!this.state.errors && <ErrorDetail>{this.state.errors.error}</ErrorDetail>}
                                </div>
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

SignupPage.propTypes = {
    profile: PropTypes.object,
    fetchRenterProfile: PropTypes.func
}

const mapStateToProps = (state) => ({
    profile: state.renterProfile,
    communityId: state.siteConfig.basename,
    hash: state.siteConfig.hash,
});

const mapDispatchToProps = { fetchRenterProfile };

export default connect(mapStateToProps, mapDispatchToProps)(SignupPage);
