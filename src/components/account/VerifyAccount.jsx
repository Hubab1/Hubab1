import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import verify from 'assets/images/verify.png';
import { H1, SpacedH3 } from 'assets/styles';
import LoginForm from 'components/common/LoginForm';
import auth from 'utils/auth';



export class VerifyAccount extends React.Component {
    state = {errors: null};
    auth=auth;

    onSubmit = (values, { setSubmitting }) => {
        return auth.login(values.email, values.password, this.props.communityId).then((res) => {
            auth.setSession(res.token, this.props.communityId);
            setSubmitting(false);
            if (this.state.errors) this.setState({errors: null});
            this.props.setVerified();
        }).catch(() => {
            const errorMessage = 'The email and password you entered do not match our records. Please try again.';
            this.setState({errors: [errorMessage]});
            setSubmitting(false);
        });
    };

    render () {
        return (
            <Fragment>
                <H1>
                    Verify Password
                </H1>
                <SpacedH3>
                    Enter your password so we can verify that it’s really you.
                </SpacedH3>
                <img src={verify} alt="welcome sign" width="101" height="91"/>
                <LoginForm
                    handleOnSubmit={this.onSubmit}
                    buttonText="Verify Password"
                    formErrors={this.state.errors}
                    email={this.props.email}
                />
            </Fragment>
        );
    }
}

VerifyAccount.propTypes = {
    communityId: PropTypes.string,
    setVerified: PropTypes.func,
    email: PropTypes.string,
};

export default VerifyAccount;
