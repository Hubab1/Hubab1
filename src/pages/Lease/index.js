import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import { ROUTES } from 'constants/constants';
import LeaseSignedPage from './pages/LeaseSigned';
import LeaseExecutedPage from './pages/LeaseExecuted';
import LeaseVoidedPage from './pages/LeaseVoided';

class LeaseContainer extends Component {
    render() {
        return (
            <Switch>
                <Route path={ROUTES.LEASE_SIGNED} component={LeaseSignedPage} />
                <Route path={ROUTES.LEASE_EXECUTED} component={LeaseExecutedPage} />
                <Route path={ROUTES.LEASE_VOIDED} component={LeaseVoidedPage} />
            </Switch>
        );
    }
}

export default LeaseContainer;
