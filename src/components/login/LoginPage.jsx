import React, { Fragment } from 'react';
import styled from '@emotion/styled';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';

import FormTextInput from 'components/common/FormTextInput/FormTextInput';
import ActionButton from 'components/common/ActionButton/ActionButton';
import { formContent, H1, P } from 'assets/styles';
import { fetchRenterProfile, selectors } from 'reducers/renter-profile';
import { ROUTES } from 'app/constants';
import GenericFormError from 'components/common/GenericFormError';

import auth from 'utils/auth';

const SkinnyH1 = styled(H1)`
    width: 70%;
    margin: auto;
    padding-bottom: 15px;
`

export class LoginPage extends React.Component {
    state = {errors: null}

    auth=auth
    onSubmit = (values, { setSubmitting }) => {
        const { history } = this.props;
        return auth.login(values.email, values.password, this.props.communityId).then((res) => {
            auth.setSession(res.token, this.props.communityId);
            setSubmitting(false);
            if (this.state.errors) this.setState({errors: null});
            this.props.fetchRenterProfile().then(() => {
                history.replace(this.props.initialPage);
            });
        }).catch((res) => {
            const errorMessage = 'The email and password you entered do not match our records. Please try again.';
            this.setState({errors: [errorMessage]});
            setSubmitting(false);
        });
    }

    render () {
        return (
            <Fragment>
                <SkinnyH1>
                    Sign In to Continue with Your Application
                </SkinnyH1>
                {!!this.state.errors && <GenericFormError errors={this.state.errors}/>}
                <Formik
                    validationSchema={Yup.object().shape({
                        email: Yup.string()
                            .email('Must be a valid Email')
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
                                <div>
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
                                <div>
                                </div>
                                <ActionButton disabled={isSubmitting} marginTop="31px" marginBottom="50px">
                                    Sign In
                                </ActionButton>
                                <Link to={ROUTES.FORGOT_PASSWORD}><P className="already-have-account">Forgot your password?</P></Link>
                                <br/>
                                <Link to={ROUTES.SIGNUP}><P className="already-have-account">Need an account?</P></Link>
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
    initialPage: selectors.selectInitialPage(state),
    communityId: state.siteConfig.basename
});

const mapDispatchToProps = { fetchRenterProfile };

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);
