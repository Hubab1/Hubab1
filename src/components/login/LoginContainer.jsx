import React, { Component } from 'react';

import LoginPage from './LoginPage';
import SignupPage from './SignupPage';


class LoginContainer extends Component {
    render() {
        if (this.props.personalized) {
            return (
                <div>
                    <LoginPage/>
                </div>
            );
        } else {
            return (
                <div>
                    <SignupPage/>
                </div>
            )
        }
    }
};

LoginContainer.defaultProps = {
    personalized: false
};

export default LoginContainer;
