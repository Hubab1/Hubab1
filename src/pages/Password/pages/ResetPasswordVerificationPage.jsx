import React, { useEffect, useCallback, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import { makeStyles, Typography } from '@material-ui/core';
import API from 'api/api';
import { ROUTES } from 'constants/constants';
import { actions as modalActions } from 'reducers/loader';

import Page from 'common-components/Page/Page';
import FormTextInput from 'common-components/FormTextInput/FormTextInput';
import BackLink from 'common-components/BackLink/BackLink';
import { LinkButton } from 'assets/styles';
import forgotPassword from 'assets/images/forgot-password.png';

export const INVALID_CODE_ERROR_MESSAGE = 'Invalid Error Code';
export const RESENT_ERROR_MESSAGE = 'Oops! We had some trouble resending your code. Please try again.';

export const validationSchema = Yup.object().shape({
    resetCode: Yup.string().max(6, 'Invalid code').matches(/^\d+$/, 'Only numbers are allowed'),
});

const initialValues = {
    resetCode: '',
};

const useStyles = makeStyles((theme) => ({
    resendCode: {
        marginTop: theme.spacing(2),
    },
    note: {
        display: 'block',
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
    },
}));

export const ResetPasswordVerificationPage = ({ communityId, history, toggleLoader }) => {
    const classes = useStyles();
    const [errors, setErrors] = useState(null);
    const phoneNumber = history.location?.state?.phoneNumber;
    const email = history.location?.state?.email;
    const recipient = phoneNumber || email;
    const channel = phoneNumber ? 'sms' : 'email';

    const notification = errors && {
        type: 'error',
        messages: errors,
    };

    useEffect(() => {
        !recipient && history.push(ROUTES.FORGOT_PASSWORD);
    }, [recipient, history]);

    const handleSubmit = useCallback(
        async (values, { setSubmitting, setErrors: setFormErrors }) => {
            setErrors(null);
            toggleLoader(true);

            try {
                const response = await API.passwordResetVerification({
                    code: values.resetCode,
                    lease_settings_id: communityId,
                    phone_number: phoneNumber,
                    channel,
                    email,
                });

                if (response.errors) {
                    setFormErrors({ resetCode: INVALID_CODE_ERROR_MESSAGE });
                } else {
                    history.push({
                        pathname: ROUTES.RESET_PASSWORD,
                        state: {
                            token: response.token,
                            channel,
                        },
                    });
                }
            } catch {
                setFormErrors({ resetCode: INVALID_CODE_ERROR_MESSAGE });
            } finally {
                toggleLoader(false);
                setSubmitting(false);
            }
        },
        [toggleLoader, phoneNumber, email, communityId, history, channel]
    );

    const handleResendLinkClick = useCallback(async () => {
        setErrors(null);
        toggleLoader(true);

        try {
            await API.passwordResetRequest({
                phone_number: phoneNumber,
                email: email,
                lease_settings_id: communityId,
                channel,
            });
        } catch {
            setErrors([RESENT_ERROR_MESSAGE]);
        } finally {
            toggleLoader(false);
        }
    }, [phoneNumber, email, communityId, channel, toggleLoader]);

    if (!recipient) return null;

    return (
        <Page
            title="Enter Verification Code"
            subTitle={
                <span>
                    We sent a text message to <strong>{recipient}</strong> with a 6 digit code to reset your password.
                </span>
            }
            image={{ src: forgotPassword }}
            notification={notification}
        >
            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                {({ values, errors: formErrors, touched, handleChange, submitCount, handleBlur, submitForm }) => {
                    const wrappedHandleChange = (event) => {
                        handleChange(event);
                        if (event.target.value.length === 6) {
                            setTimeout(submitForm, 0);
                        }
                    };

                    return (
                        <Form autoComplete="off">
                            <FormTextInput
                                label="Enter Code"
                                name="resetCode"
                                submitted={submitCount > 0}
                                handleChange={wrappedHandleChange}
                                handleBlur={handleBlur}
                                error={formErrors.resetCode}
                                touched={touched.resetCode}
                                value={values.resetCode}
                                type="tel"
                            />
                        </Form>
                    );
                }}
            </Formik>
            <Typography variant="body1" className={classes.resendCode}>
                Didn&apos;t Receive a text?{' '}
                <LinkButton data-testid="resent-code-link" onClick={handleResendLinkClick}>
                    Resend Here
                </LinkButton>
            </Typography>
            <Typography variant="caption" className={classes.note}>
                We’ll only send a code if the email or phone number you entered is associated with an account. It may
                take a few minutes to arrive.
            </Typography>
            <BackLink to={ROUTES.FORGOT_PASSWORD} />
        </Page>
    );
};

ResetPasswordVerificationPage.propTypes = {
    communityId: PropTypes.string,
    history: PropTypes.object,
    toggleLoader: PropTypes.func,
};

const mapStateToProps = (state) => ({
    communityId: state.siteConfig.basename,
});

const mapDispatchToProps = {
    toggleLoader: modalActions.toggleLoader,
};

export default connect(mapStateToProps, mapDispatchToProps)(ResetPasswordVerificationPage);
