import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import RenterProfileOptions from 'components/profile/options/RenterProfileOptions';


class ProfileContainer extends Component {
    render() {
        const { match }= this.props;
        return (
            <Switch>
                <Route path={`${match.url}/options`} component={RenterProfileOptions} />
                <Redirect exact to={`${match.url}/options`} />
            </Switch>
        );
    }
};

export default ProfileContainer;
