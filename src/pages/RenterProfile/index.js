import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import { ROUTES } from 'constants/constants';
import RenterProfileOptionsPage from './pages/RenterProfileOptions';
import GuarantorPage from './pages/Guarantor';
import InviteRoommatesPage from './pages/InviteRoommates';
import PetsPage from './pages/Pets';
import StoragePage from './pages/Storage';
import ParkingPage from './pages/Parking';
import EditDependentPage from './pages/EditDependent';
import RemovePersonPage from './pages/RemovePerson';
import WineCoolerPage from './pages/WineCooler';

class RentalProfileContainer extends Component {
    render() {
        return (
            <Switch>
                <Route path={ROUTES.PROFILE_OPTIONS} component={RenterProfileOptionsPage} />
                <Route path={ROUTES.GUARANTOR} component={GuarantorPage} />
                <Route path={ROUTES.CO_APPLICANTS} component={InviteRoommatesPage} />
                <Route path={ROUTES.PETS} component={PetsPage} />
                <Route path={ROUTES.STORAGE} component={StoragePage} />
                <Route path={ROUTES.PARKING} component={ParkingPage} />
                <Route path={ROUTES.WINE_COOLER} component={WineCoolerPage} />
                <Route path={ROUTES.EDIT_DEPENDANT} component={EditDependentPage} />
                <Route path={ROUTES.REMOVE_PERSON} component={RemovePersonPage} />
            </Switch>
        );
    }
}

export default RentalProfileContainer;
