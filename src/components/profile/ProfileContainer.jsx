import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import { buildRoute } from 'utils/routeNavigation';
import { Routes } from 'constants.js';
import RenterProfileOptions from 'components/profile/options/RenterProfileOptions';


class ProfileContainer extends Component {
    render() {
        const { match }= this.props;
        return (
            <Switch>
                <Route path={buildRoute(match.url, Routes.profile.OPTIONS)} component={RenterProfileOptions} />
            </Switch>
        );
    }
};

export default ProfileContainer;
