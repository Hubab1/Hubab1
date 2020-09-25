import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import API from 'app/api';
import { ROUTES } from 'app/constants';
import thumbsUp from 'assets/images/thumbs-up.png';
import { H1 } from 'assets/styles';
import ConfirmationPage from 'components/common/ConfirmationPage/ConfirmationPage';
import ChangePasswordForm from 'components/common/ChangePasswordForm';


export default class ResetPassword extends React.Component {
    state = {
        confirmReset: false,
        errors: null
    }
    onSubmit = (values, { setSubmitting }) => {
        const token = this.props.history.location.state.token;

        return API.passwordReset(values.password, token).then((res) => {
            if (res.errors) {
                this.setState({errors: res.errors});
            } else {
                this.setState({confirmReset: true});
            }
            setSubmitting(false);
        }).catch((res) => {
            this.setState({errors: ['There was an error with resetting your password. Please try again.']});
            setSubmitting(false);
        });
    }

    render () {
        if (this.state.confirmReset) {
            return <ConfirmationPage
                successMessage="Success! Your Password Has Been Reset."
                confirmationImage={thumbsUp}
                buttonClick={() => this.props.history.push(ROUTES.LOGIN)}
                buttonText="Sign in"
                   />;
        }
        return (
            <Fragment>
                <H1>
                    Reset Password
                </H1>
                <ChangePasswordForm onSubmit={this.onSubmit} errors={this.state.errors}/>
            </Fragment>
        );
    }
}

ResetPassword.propTypes = {
    history: PropTypes.object
};
