import React, { Component } from 'react';

import Terms from './Terms';
import { Route, Switch } from 'react-router-dom';


class MainContainer extends Component {
    render() {
        return (
            <Switch>
                <Route path="/terms" component={Terms}/>
            </Switch>
        );
    }
}

export default MainContainer;
