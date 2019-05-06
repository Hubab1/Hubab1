import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import * as Yup from 'yup';

import FormTextInput from 'components/common/FormTextInput/FormTextInput';
import ActionButton from 'components/common/ActionButton/ActionButton';
import { formContent, H1, P } from 'assets/styles';
import { fetchRenterProfile } from 'reducers/renter-profile';
import { initializePage } from 'utils/initializePage';


import auth from 'utils/auth';


export class LoginPage extends React.Component {
    auth=auth
    onSubmit = (values, { setSubmitting }) => {
        return auth.login(values.username, values.password).then((res) => {
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
                <H1>
                    Sign in to continue with your application
                </H1>

                <Formik
                    validationSchema={Yup.object().shape({
                        email: Yup.string().required('Email is required'),
                        password: Yup.string().required('Password is required'),
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
                            <div className={formContent}>
                                <div>
                                    <FormTextInput
                                        label="Email or phone number"
                                        name="email"
                                        submitted={submitCount > 0}
                                        handleChange={handleChange}
                                        handleBlur={handleBlur}
                                        error={errors.email}
                                        touched={touched.email}
                                        value={values.email}
                                    />
                                    <FormTextInput
                                        label="Password"
                                        type="password"
                                        name="password"
                                        submitted={submitCount > 0}
                                        handleChange={handleChange}
                                        handleBlur={handleBlur}
                                        error={errors.password}
                                        touched={touched.password}
                                        value={values.password}
                                    />
                                </div>
                                <ActionButton disabled={isSubmitting} marginTop="31px" marginBottom="153px">
                                    Sign In
                                </ActionButton>
                                {/* eslint-disable-next-line */}
                                <P className="already-have-account">Forgot your password? <a href="#">Click here</a></P>
                                <br/>
                                {/* eslint-disable-next-line */}
                                <P className="already-have-account">Need an account? <a href="#">Click here</a></P>
                            </div>
                        </form>
                    )}
                </Formik>
            </Fragment>
        );
    }
}

LoginPage.propTypes = {
    fetchRenterProfile: PropTypes.func,
    profile: PropTypes.object
}

const mapStateToProps = (state) => ({
    profile: state.renterProfile,
});

const mapDispatchToProps = { fetchRenterProfile };

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);
