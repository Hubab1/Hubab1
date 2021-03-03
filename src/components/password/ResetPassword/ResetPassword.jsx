import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import API from 'app/api';
import { ROUTES } from 'app/constants';
import { actions as modalActions } from 'reducers/loader';

import ConfirmationPage from 'components/common/ConfirmationPage/ConfirmationPage';
import ChangePasswordForm from 'components/common/ChangePasswordForm';
import { H1 } from 'assets/styles';
import thumbsUp from 'assets/images/thumbs-up.png';

export class ResetPassword extends React.Component {
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
                this.props.toggleLoader(true);
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

ResetPassword.propTypes = {
    history: PropTypes.object,
    toggleLoader: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword);
