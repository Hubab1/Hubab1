import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';

import FormTextInput from 'components/common/FormTextInput/FormTextInput';
import ActionButton from 'components/common/ActionButton/ActionButton';
import { formContent, H1, P } from 'assets/styles';
import { fetchRenterProfile } from 'reducers/renter-profile';
import { Routes } from 'constants.js';


import auth from 'utils/auth';
import AppContext from 'contexts/AppContext';


export class LoginPage extends React.Component {
    static contextType = AppContext;

    auth=auth
    onSubmit = (values, { setSubmitting }) => {
        return auth.login(values.username, values.password).then((res) => {
            auth.setSession(res.token, this.context.communityId);
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
                    isSubmitting
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
                            <P className="already-have-account">Need an account? <Link to={`/${this.context.communityId}/${Routes.SIGNUP}`}>Click here</Link></P>
                        </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);
