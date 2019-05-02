import React from 'react';
import { connect } from 'react-redux';
import { buildRoute } from 'utils/routeNavigation';
import createTheme from 'assets/createTheme';
import auth from 'utils/auth';
import queryString from 'query-string';
import { fetchLeaseSettings } from 'reducers/lease-settings';
import { fetchRenterProfile } from 'reducers/renter-profile';


async function sessionIsValidForCommunityId (communityId) {
    if (auth.accessScope() === communityId) {
        // maybe do some api call to check that this authentication token is valid for this community
        // eg const isValidSession = await API.checkToken(community, auth.getToken());
        return true;
    }
    return false;
}

class RootRoute extends React.Component {
    mountNavigation(isAuthenticated, leaseSettings) {
        const { fetchRenterProfile, match, history } = this.props;
        if (!isAuthenticated) {
            if (!leaseSettings.client) {
                history.replace(buildRoute(match.url, 'welcome'));
            }
            else if (leaseSettings.client && leaseSettings.client.application_id) {
                history.replace(buildRoute(match.url, 'login'));
            } else {
                history.replace(buildRoute(match.url, 'welcome'));
            }
        } else {
            fetchRenterProfile();
        }
    }
    
    async componentDidMount () {
        const communityId = this.props.match.params.communityId;
        const leaseSettings = this.props.leaseSettings;
        const isLoggedIn = auth.isAuthenticated() && !!await sessionIsValidForCommunityId(communityId);
        this.mountNavigation(isLoggedIn, leaseSettings);
    }
    
    render () {
        return <div>Root!</div>
    }
}


const mapStateToProps = state => ({
    profile: state.renterProfile,
    leaseSettings: state.leaseSettings
});

const mapDispatchToProps = {fetchRenterProfile, fetchLeaseSettings};


export default connect(mapStateToProps, mapDispatchToProps)(RootRoute);