import React, { useState, useCallback } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import API from 'api/api';
import { ROUTES } from 'constants/constants';
import { phoneNumberValidationRegex } from 'utils/formik';
import { actions as modalActions } from 'reducers/loader';

import Page from 'common-components/Page/Page';
import PhoneNumberInput from 'common-components/PhoneNumberInput/PhoneNumberInput';
import FormTextInput from 'common-components/FormTextInput/FormTextInput';
import ActionButton from 'common-components/ActionButton/ActionButton';
import BackLink from 'common-components/BackLink/BackLink';
import { LinkButton } from 'assets/styles';
import forgotPassword from 'assets/images/forgot-password.png';

export const ERROR_MESSAGE = 'Oops! We had some trouble resetting your password. Try again in a little bit.';

export const validationSchema = Yup.object().shape(
    {
        phone: Yup.string()
            .nullable()
            .when('email', {
                is: (val) => !val,
                then: Yup.string()
                    .required('Phone Number is required')
                    .matches(phoneNumberValidationRegex, 'Must be a valid US phone number'),
                otherwise: Yup.string(),
            }),
        email: Yup.string()
            .nullable()
            .when('phone', {
                is: (val) => !val,
                then: Yup.string().required('Email is required').email('Email must be a valid email'),
                otherwise: Yup.string(),
            }),
    },
    ['phone', 'email']
);

const initialValues = {
    phone: '',
    email: '',
};

export const ForgotPasswordPage = ({ communityId, history, toggleLoader }) => {
    const [errors, setErrors] = useState(null);
    const [usePhone, setUsePhone] = useState(true);
    const channel = usePhone ? 'sms' : 'email';
    const notification = errors && {
        type: 'error',
        messages: errors,
    };

    const togglePhoneAndEmail = useCallback(
        (resetForm) => {
            resetForm();
            setUsePhone(!usePhone);
        },
        [usePhone]
    );

    const handleSubmit = useCallback(
        async (values, { setSubmitting }) => {
            setErrors(null);
            toggleLoader(true);

            try {
                await API.passwordResetRequest({
                    phone_number: values.phone,
                    email: values.email,
                    lease_settings_id: communityId,
                    channel,
                });

                history.push({
                    pathname: ROUTES.VERIFY_PASSWORD_CODE,
                    state: {
                        phoneNumber: values.phone,
                        email: values.email,
                    },
                });
            } catch {
                setErrors([ERROR_MESSAGE]);
            } finally {
                toggleLoader(false);
                setSubmitting(false);
            }
        },
        [channel, communityId, history, toggleLoader]
    );

    return (
        <Page
            title="Forgot Your Password?"
            subTitle="Don't worry! We'll send you a message with a code to reset your password."
            image={{ src: forgotPassword }}
            notification={notification}
        >
            <Formik validationSchema={validationSchema} initialValues={initialValues} onSubmit={handleSubmit}>
                {({ values, errors: formErrors, handleChange, resetForm, submitCount, handleSubmit, isSubmitting }) => (
                    <Form onSubmit={handleSubmit} autoComplete="off">
                        {usePhone ? (
                            <PhoneNumberInput
                                data-testid="phone-number-input"
                                label="Phone Number"
                                name="phone"
                                value={values.phone}
                                handleChange={handleChange}
                                error={submitCount > 0 && !!formErrors.phone}
                                helperText={submitCount > 0 ? formErrors.phone : null}
                            />
                        ) : (
                            <FormTextInput
                                data-testid="email-input"
                                label="Email"
                                name="email"
                                submitted={submitCount > 0}
                                handleChange={handleChange}
                                error={submitCount > 0 && !!formErrors.email}
                                helperText={submitCount > 0 ? formErrors.email : null}
                            />
                        )}
                        <LinkButton
                            data-testid="channel-link"
                            type="reset"
                            style={{ width: '100%', textAlign: 'left' }}
                            onClick={() => togglePhoneAndEmail(resetForm)}
                        >
                            {usePhone ? 'Use email instead' : 'Use phone instead'}
                        </LinkButton>
                        <ActionButton disabled={isSubmitting} marginTop={31} marginBottom={20}>
                            Send Code
                        </ActionButton>
                        <BackLink to={ROUTES.LOGIN} />
                    </Form>
                )}
            </Formik>
        </Page>
    );
};

ForgotPasswordPage.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPasswordPage);
