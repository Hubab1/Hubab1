import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import * as Yup from 'yup';

import FormTextInput from 'components/common/FormTextInput/FormTextInput';
import { formContent, H1, H3, P } from 'assets/styles';
import { fetchRenterProfile } from 'reducers/renter-profile';
import { ROUTES } from 'app/constants';
import API from 'app/api';

export class ResetPasswordVerificationPage extends React.Component {

    componentDidMount() {
        !this.props.history.location.state && this.props.history.push(ROUTES.FORGOT_PASSWORD);
    }

    onSubmit = (values, { setSubmitting, setErrors }) => {
        const phoneNumber = this.props.history.location.state.phoneNumber;
        const code = values.resetCode;
        return API.passwordResetVerification(phoneNumber, code).then(() => {
            setSubmitting(false);
            this.props.history.push(ROUTES.RESET_PASSWORD);
        }).catch((res) => {
            setErrors({resetCode: res.errors})
            setSubmitting(false);   
        })
    }

    render () {
        if (!this.props.history.location.state) return <div></div>;
        const phoneNumber = this.props.history.location.state.phoneNumber;
        return (
            <Fragment>
                <H1>
                    Enter Verification Code 
                </H1>
                <H3>
                We sent a text message to <strong>{phoneNumber}</strong> with a 6 digit code to reset your password.
                </H3>

                <Formik
                    validationSchema={Yup.object().shape({
                        resetCode: Yup.string()
                            .max(6, 'Invalid code')
                            .matches(/^\d+$/, 'Only numbers are allowed')
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
                        submitForm,
                    }) => {
                        const wrappedHandleChange = (event) => {
                            handleChange(event);
                            if (event.target.value.length === 6) {
                                setTimeout(submitForm, 0);
                            }
                        }
                        return (
                            <form onSubmit={handleSubmit} autoComplete="off">
                                <div className={formContent}>
                                    <div>
                                        <FormTextInput
                                            label="Enter Code"
                                            name="resetCode"
                                            submitted={submitCount > 0}
                                            handleChange={wrappedHandleChange}
                                            handleBlur={handleBlur}
                                            error={errors.resetCode}
                                            touched={touched.resetCode }
                                            value={values.resetCode}
                                        />
                                    </div>
                                </div>
                            </form>
                        )

                    }}
                </Formik>
                <P>Didn't Receive a text? <a href='' role="button" onClick={() => console.log('you clict')}>Resend Here</a></P>
            </Fragment>
        );
    }
}

ResetPasswordVerificationPage.propTypes = {
    fetchRenterProfile: PropTypes.func,
    profile: PropTypes.object
}

const mapStateToProps = (state) => ({
    profile: state.renterProfile,
    communityId: state.siteConfig.basename
});

const mapDispatchToProps = { fetchRenterProfile };

export default connect(mapStateToProps, mapDispatchToProps)(ResetPasswordVerificationPage);
