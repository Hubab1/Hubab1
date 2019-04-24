import React, { Component } from 'react';

import Terms from 'components/main/Terms';
import WelcomePage from 'components/main/WelcomePage';

import { Route, Switch } from 'react-router-dom';


class MainContainer extends Component {
    render() {
        return (
            <Switch>
                <Route path="/welcome" component={WelcomePage}/>
                <Route path="/terms" component={Terms}/>
            </Switch>
        );
    }
}

export default MainContainer;
