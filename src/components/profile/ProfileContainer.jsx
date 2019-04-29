import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import RenterProfileOptions from 'components/profile/options/RenterProfileOptions';


class ProfileContainer extends Component {
    render() {
        return (
            <Switch>
                <Route path="/profile/options" component={RenterProfileOptions} />
            </Switch>
        );
    }
};

export default ProfileContainer;
