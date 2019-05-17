import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import { ROUTES } from 'app/constants';
import RenterProfileOptions from 'components/profile/options/RenterProfileOptions';
import InviteRoommatesPage from 'components/profile/InviteRoommatesPage;


class ProfileContainer extends Component {
    render() {
        return (
            <Switch>
            <Route path={ROUTES.PROFILE_OPTIONS} component={RenterProfileOptions} />
            <Route path={ROUTES.ROOMMATES} component={InviteRoommatesPages} />
            </Switch>
        );
    }
};

export default ProfileContainer;
