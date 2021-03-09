import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import API from 'api/api';
import { ROUTES } from 'constants/constants';
import { actions as modalActions } from 'reducers/loader';

import ConfirmationPage from 'common-components/Pages/ConfirmationPage/ConfirmationPage';
import ChangePasswordForm from 'common-components/Forms/ChangePasswordForm/ChangePasswordForm';
import { H1 } from 'assets/styles';
import thumbsUp from 'assets/images/thumbs-up.png';

export class ResetPasswordPage extends Component {
    state = {
        confirmReset: false,
        errors: null,
    };

    onSubmit = (values, { setSubmitting }) => {
        const token = this.props.history.location.state.token;

        this.props.toggleLoader(true);

        return API.passwordReset(values.password, token)
            .then((res) => {
                if (res.errors) {
                    this.setState({ errors: res.errors });
                } else {
                    this.setState({ confirmReset: true });
                }
            })
            .catch(() => {
                this.setState({ errors: ['There was an error with resetting your password. Please try again.'] });
            })
            .finally(() => {
                this.props.toggleLoader(false);
                setSubmitting(false);
            });
    };

    render() {
        if (this.state.confirmReset) {
            return (
                <ConfirmationPage
                    successMessage="Success! Your Password Has Been Reset."
                    confirmationImage={thumbsUp}
                    buttonClick={() => this.props.history.push(ROUTES.LOGIN)}
                    buttonText="Sign in"
                />
            );
        }
        return (
            <>
                <H1>Reset Password</H1>
                <ChangePasswordForm onSubmit={this.onSubmit} errors={this.state.errors} />
            </>
        );
    }
}

const mapStateToProps = null;

const mapDispatchToProps = {
    toggleLoader: modalActions.toggleLoader,
};

ResetPasswordPage.propTypes = {
    history: PropTypes.object,
    toggleLoader: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(ResetPasswordPage);
