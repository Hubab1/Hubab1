import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import API from 'api/api';
import { ROUTES } from 'constants/constants';
import { actions as modalActions } from 'reducers/loader';

import ChangePasswordForm from 'common-components/ChangePasswordForm/ChangePasswordForm';
import ConfirmationPage from 'pages/Confirmation';
import { H1 } from 'assets/styles';
import thumbsUp from 'assets/images/thumbs-up.png';

export const SUCCESS_MESSAGE = 'Success! Your Password Has Been Reset.';
export const ERROR_MESSAGE = 'There was an error with resetting your password. Please try again.';

export const ResetPasswordPage = ({ history, toggleLoader }) => {
    const [confirmReset, setConfirmReset] = useState(false);
    const [errors, setErrors] = useState(null);
    const token = history?.location?.state?.token;

    useEffect(() => {
        !token && history.push(ROUTES.FORGOT_PASSWORD);
    }, [token, history]);

    const handleSubmit = useCallback(
        async (values, { setSubmitting }) => {
            toggleLoader(true);

            try {
                const response = await API.passwordReset(values.password, token, true);

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
        [token, toggleLoader]
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
        <>
            <H1>Reset Password</H1>
            <ChangePasswordForm onSubmit={handleSubmit} errors={errors} />
        </>
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
