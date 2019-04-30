import 'assets/emotion/styles';

import React, { Component } from 'react';
import { Route, Switch, Router } from 'react-router-dom';
import { connect } from 'react-redux';

import Main from './Main';
import BadRoute from 'components/common/BadRoute';
import history from 'history.js';

import { fetchRenterProfile } from 'reducers/renter-profile';
import { fetchLeaseSettings } from 'reducers/lease-settings';

export default class App extends Component {
    render() {
        const routes = (
            <Switch>
                <Route path="/:communityId" component={Main} />
                <Route exact path="/" component={BadRoute} />
            </Switch>
        );
        return (
            <div className="App">
                <Router history={history}>
                    {routes}
                </Router>
            </div>
        );
    }
}