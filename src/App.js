import 'assets/emotion/styles';

import React, { Component } from 'react';
import { Route, Switch, Router } from 'react-router-dom';

import Main from './Main';
import BadRoute from 'components/common/BadRoute';
import history from 'history.js';

export default class App extends Component {
    render() {
        return (
            <div className="App">
                <Router history={history}>
                    <Switch>
                        <Route path="/:communityId" component={Main} />
                        <Route exact path="/" component={BadRoute} />
                    </Switch>
                </Router>
            </div>
        );
    }
}