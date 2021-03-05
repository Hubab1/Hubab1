import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import * as Yup from 'yup';
import styled from '@emotion/styled';

import { ROUTES } from 'constants/constants';
import API from 'api/api';
import { actions as modalActions } from 'reducers/loader';

import FormTextInput from 'components//FormTextInput/FormTextInput';
import { formContent, H1, H3, P, LinkButton } from 'assets/styles';
import forgotPassword from 'assets/images/forgot-password.png';

const SpacedH3 = styled(H3)`
    margin: 20px 15% 25px 15%;
`;

const validationSchema = Yup.object().shape({
    resetCode: Yup.string().max(6, 'Invalid code').matches(/^\d+$/, 'Only numbers are allowed'),
});

const initialValues = {
    resetCode: '',
};

export class ResetPasswordVerificationPage extends Component {
    componentDidMount() {
        !this.props.history.location.state && this.props.history.push(ROUTES.FORGOT_PASSWORD);
    }

    onSubmit = (values, { setSubmitting, setErrors }) => {
        const phoneNumber = this.props.history.location.state.phoneNumber;
        const code = values.resetCode;
        const communityId = this.props.communityId;

        this.props.toggleLoader(true);

        return API.passwordResetVerification(phoneNumber, code, communityId)
            .then((res) => {
                if (res.errors) {
                    setErrors({ resetCode: 'Invalid Error Code' });
                } else {
                    this.props.history.push({
                        pathname: ROUTES.RESET_PASSWORD,
                        state: { token: res.token },
                    });
                }
            })
            .catch(() => {
                setErrors({ resetCode: 'Invalid Error Code' });
            })
            .finally(() => {
                this.props.toggleLoader(false);
                setSubmitting(false);
            });
    };

    handleClickLink = () => {
        const { communityId, history } = this.props;
        const phoneNumber = history.location.state.phoneNumber;

        API.passwordResetRequest(phoneNumber, communityId);
    };

    render() {
        if (!this.props.history.location.state) return <div />;
        const phoneNumber = this.props.history.location.state.phoneNumber;

        return (
            <>
                <H1>Enter Verification Code</H1>
                <SpacedH3>
                    We sent a text message to <strong>{phoneNumber}</strong> with a 6 digit code to reset your password.
                </SpacedH3>
                <img src={forgotPassword} alt="hand with smartphone in it" />
                <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={this.onSubmit}>
                    {({ values, errors, touched, handleChange, submitCount, handleBlur, handleSubmit, submitForm }) => {
                        const wrappedHandleChange = (event) => {
                            handleChange(event);
                            if (event.target.value.length === 6) {
                                setTimeout(submitForm, 0);
                            }
                        };
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
                                            touched={touched.resetCode}
                                            value={values.resetCode}
                                            type="tel"
                                        />
                                    </div>
                                </div>
                            </form>
                        );
                    }}
                </Formik>
                <P>
                    Didn&apos;t Receive a text? <LinkButton onClick={this.handleClickLink}>Resend Here</LinkButton>
                </P>
            </>
        );
    }
}

ResetPasswordVerificationPage.propTypes = {
    profile: PropTypes.object,
    history: PropTypes.object,
    communityId: PropTypes.string,
    toggleLoader: PropTypes.func,
};

const mapStateToProps = (state) => ({
    profile: state.renterProfile,
    communityId: state.siteConfig.basename,
});

const mapDispatchToProps = {
    toggleLoader: modalActions.toggleLoader,
};

export default connect(mapStateToProps, mapDispatchToProps)(ResetPasswordVerificationPage);
