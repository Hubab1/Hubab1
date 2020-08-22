import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import { ROUTES } from 'app/constants';
import RenterProfileOptions from 'components/profile/options/RenterProfileOptions';
import GuarantorPage from 'components/profile/GuarantorPage';
import InviteRoommatesPage from 'components/profile/InviteRoommatesPage';
import PetsPage from 'components/profile/pets/PetsPage';
import Storage from 'components/profile/Storage';
import Parking from 'components/profile/Parking';
import EditDependent from 'components/profile/EditDependent'
import RemovePerson from 'components/profile/RemovePerson';

class RentalProfileContainer extends Component {
    render() {
        return (
            <Switch>
                <Route path={ROUTES.PROFILE_OPTIONS} component={RenterProfileOptions} />
                <Route path={ROUTES.GUARANTOR} component={GuarantorPage} />
                <Route path={ROUTES.CO_APPLICANTS} component={InviteRoommatesPage} />
                <Route path={ROUTES.PETS} component={PetsPage} />
                <Route path={ROUTES.STORAGE} component={Storage} />
                <Route path={ROUTES.PARKING} component={Parking} />
                <Route path={ROUTES.EDIT_DEPENDANT} component={EditDependent} />
                <Route path={ROUTES.REMOVE_PERSON} component={RemovePerson} />
            </Switch>
        );
    }
};

export default RentalProfileContainer;
