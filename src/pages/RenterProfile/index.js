import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import { ROUTES } from 'constants/constants';
import RenterProfileOptionsPage from './RentalProfileOptionsPage/RenterProfileOptionsPage';
import GuarantorPage from './GuarantorPage/GuarantorPage';
import InviteRoommatesPage from './InviteRoommatesPage/InviteRoommatesPage';
import PetsPage from './PetsPage/PetsPage';
import StoragePage from './StoragePage/StoragePage';
import ParkingPage from './ParkingPage/ParkingPage';
import EditDependentPage from './EditDependentPage/EditDependentPage';
import RemovePersonPage from './RemovePersonPage/RemovePersonPage';
import WineCoolerPage from './WineCoolerPage/WineCoolerPage';

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
