import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import { ROUTES } from 'app/constants';
import RenterProfileOptions from 'components/profile/options/RenterProfileOptions';
import GuarantorPage from 'components/profile/options/GuarantorPage';
import InviteRoommatesPage from 'components/profile/InviteRoommatesPage';

class ProfileContainer extends Component {
    render() {
        return (
            <Switch>
                <Route path={ROUTES.PROFILE_OPTIONS} component={RenterProfileOptions} />
                <Route path={ROUTES.GUARANTOR} component={GuarantorPage} />
                <Route path={ROUTES.INVITE_ROOMMATES} component={InviteRoommatesPage} />
            </Switch>
        );
    }
};

export default ProfileContainer;
