import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import API from 'api/api';
import { ROUTES } from 'constants/constants';
import { actions as modalActions } from 'reducers/loader';

import Page from 'common-components/Page/Page';
import ChangePasswordForm from 'common-components/ChangePasswordForm/ChangePasswordForm';
import ConfirmationPage from 'pages/Confirmation';
import thumbsUp from 'assets/images/thumbs-up.png';

export const SUCCESS_MESSAGE = 'Success! Your Password Has Been Reset.';
export const ERROR_MESSAGE = 'There was an error with resetting your password. Please try again.';

export const ResetPasswordPage = ({ history, toggleLoader }) => {
    const [confirmReset, setConfirmReset] = useState(false);
    const [errors, setErrors] = useState(null);
    const token = history?.location?.state?.token;
    const channel = history?.location?.state?.channel;

    useEffect(() => {
        !token && history.push(ROUTES.FORGOT_PASSWORD);
    }, [token, history]);

    const handleSubmit = useCallback(
        async (values, { setSubmitting }) => {
            toggleLoader(true);

            try {
                const response = await API.passwordReset(
                    {
                        password: values.password,
                        recovered_password: true,
                        recovered_password_channel: channel,
                    },
                    token
                );

                if (response.errors) {
                    setErrors(response.errors);
                } else {
                    setConfirmReset(true);
                }
            } catch {
                setErrors([ERROR_MESSAGE]);
            } finally {
                toggleLoader(false);
                setSubmitting(false);
            }
        },
        [token, channel, toggleLoader]
    );

    if (!token) return null;

    if (confirmReset) {
        return (
            <ConfirmationPage
                successMessage={SUCCESS_MESSAGE}
                confirmationImage={thumbsUp}
                buttonClick={() => history.push(ROUTES.LOGIN)}
                buttonText="Sign in"
            />
        );
    }

    return (
        <Page title="Reset Password">
            <ChangePasswordForm onSubmit={handleSubmit} errors={errors} />
        </Page>
    );
};

const mapStateToProps = null;

const mapDispatchToProps = {
    toggleLoader: modalActions.toggleLoader,
};

ResetPasswordPage.propTypes = {
    history: PropTypes.object,
    toggleLoader: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(ResetPasswordPage);
