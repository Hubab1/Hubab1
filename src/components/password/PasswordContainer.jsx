import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import { ROUTES } from 'app/constants';
import ForgotPasswordPage from 'components/password/ForgotPasswordPage';
import ResetPasswordVerificationPage from 'components/password/ResetPasswordVerification/ResetPasswordVerificationPage';
import ResetPassword from 'components/password/ResetPassword/ResetPassword';
import UnauthenticatedPage from 'components/common/Page/UnauthenticatedPage';


class PasswordContainer extends Component {
    render() {
        return (
            <UnauthenticatedPage>
                <Switch>
                    <Route path={ROUTES.RESET_PASSWORD} component={ResetPassword} />
                    <Route path={ROUTES.FORGOT_PASSWORD} component={ForgotPasswordPage} />
                    <Route path={ROUTES.VERIFY_PASSWORD_CODE} component={ResetPasswordVerificationPage} />
                </Switch>
            </UnauthenticatedPage>
        );
    }
};

export default PasswordContainer;
