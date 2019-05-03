import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import { FullRoutes } from 'constants.js';
import RenterProfileOptions from 'components/profile/options/RenterProfileOptions';


class ProfileContainer extends Component {
    render() {
        return (
            <Switch>
                <Route path={FullRoutes.PROFILE_OPTIONS} component={RenterProfileOptions} />
            </Switch>
        );
    }
};

export default ProfileContainer;
