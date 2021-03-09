import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import { ROUTES } from 'constants/constants';
import UnauthenticatedPage from 'common-components/Pages/UnauthenticatedPage/UnauthenticatedPage';
import ResetPassword from './ResetPasswordPage/ResetPasswordPage';
import ForgotPasswordPage from './ForgotPasswordPage/ForgotPasswordPage';
import ResetPasswordVerificationPage from './ResetPasswordVerificationPage/ResetPasswordVerificationPage';

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
}

export default PasswordContainer;
