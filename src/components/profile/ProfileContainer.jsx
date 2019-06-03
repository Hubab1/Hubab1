import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import { ROUTES } from 'app/constants';
import RenterProfileOptions from 'components/profile/options/RenterProfileOptions';
import GuarantorPage from 'components/profile/options/GuarantorPage';
import InviteRoommatesPage from 'components/profile/InviteRoommatesPage';
import PetsPage from 'components/profile/pets/PetsPage';

class ProfileContainer extends Component {
    render() {
        return (
            <Switch>
                <Route path={ROUTES.PROFILE_OPTIONS} component={RenterProfileOptions} />
                <Route path={ROUTES.GUARANTOR} component={GuarantorPage} />
                <Route path={ROUTES.ROOMMATES} component={InviteRoommatesPage} />
<<<<<<< HEAD
                <Route path={ROUTES.PETS} component={PetsPage} />
=======
>>>>>>> master
            </Switch>
        );
    }
};

export default ProfileContainer;
