import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import { ROUTES } from 'constants/constants';
import ApplicationCompletePage from './pages/ApplicationComplete';
import ApplicationApprovedPage from './pages/ApplicationApproved';
import ApplicationDeniedPage from './pages/ApplicationDenied';
import ApplicationCancelledPage from './pages/ApplicationCancelled';

class ApplicationContainer extends Component {
    render() {
        return (
            <Switch>
                <Route path={ROUTES.APP_COMPLETE} component={ApplicationCompletePage} />
                <Route path={ROUTES.APP_APPROVED} component={ApplicationApprovedPage} />
                <Route path={ROUTES.APP_DENIED} component={ApplicationDeniedPage} />
                <Route path={ROUTES.APP_CANCELLED} component={ApplicationCancelledPage} />
            </Switch>
        );
    }
}

export default ApplicationContainer;
