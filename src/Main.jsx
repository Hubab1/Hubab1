import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import queryString from 'query-string';
import { generatePath } from 'react-router';

import AppContextProvider from 'contexts/AppContextProvider';
import WelcomePage from 'components/welcome/WelcomePage';
import ProfileContainer from 'components/profile/ProfileContainer';
import LoginPage from 'components/login/LoginPage';
import SignupPage from 'components/SignupPage';
import TermsPage from 'components/TermsPage';
import Page from 'components/common/Page/Page';
import createTheme from 'assets/createTheme';
import auth from 'utils/auth';
import { fetchRenterProfile } from 'reducers/renter-profile';
import { fetchLeaseSettings } from 'reducers/lease-settings';
import { getInitialPage } from 'utils/routeNavigation';
import { ROUTES } from 'constants.js';

async function sessionIsValidForCommunityId (communityId) {
    if (auth.accessScope() === communityId) {
        // maybe do some api call to check that this authentication token is valid for this community
        // eg const isValidSession = await API.checkToken(community, auth.getToken());
        return true;
    }
    return false;
}

export class Main extends Component {
    state = {theme: null}

    mountNavigation(isAuthenticated, leaseSettings) {
        const { fetchRenterProfile, history, location, match } = this.props;
        const communityId = match.params.communityId;
        if (!isAuthenticated) {
            if (location.pathname.includes('login') || location.pathname.includes('signup')) return;
            if (!leaseSettings.client) {
                history.replace(generatePath(ROUTES.WELCOME, {communityId}));
            }
            else if (leaseSettings.client && leaseSettings.client.application_id) {
                history.replace(generatePath(ROUTES.LOGIN, {communityId}));
            } else {
                history.replace(generatePath(ROUTES.WELCOME, {communityId}));
            }
        } else {
            fetchRenterProfile();
        }
    }

    async componentDidMount () {
        const communityId = this.props.match.params.communityId;
        const isLoggedIn = auth.isAuthenticated() && await sessionIsValidForCommunityId(communityId);

        let params = queryString.parse(this.props.location.search);
        const leaseSettings = await this.props.fetchLeaseSettings(communityId, params.v);
        const primaryColor = leaseSettings.primary_color;
        const secondaryColor = leaseSettings.secondary_color;
        this.setState({theme: createTheme(primaryColor, secondaryColor)});

        this.mountNavigation(isLoggedIn, leaseSettings);
    }

    componentDidUpdate (prevProps) {
        // i figured this might be worth handling, but probably should come up with better way to handle this another time
        const { history, match } = this.props;
        const communityId = match.params.communityId;
        if (prevProps.match.params.communityId !== communityId) {
            console.error('Error, changing community is not supported');
            throw new Error();
        }

        if (!prevProps.profile && this.props.profile) {
            const initialPage = getInitialPage(communityId, this.props.profile);
            history.replace(generatePath(initialPage, {communityId}));
        }
    }

    render() {
        const theme = this.state.theme;
        if (!theme) return null;
        const { match }= this.props;
        const communityId = match.params.communityId;
        return (
            <AppContextProvider theme={theme} communityId={communityId}>
                <div className="App">
                    <Switch>
                        <Route path={ROUTES.WELCOME} component={WelcomePage}/>
                        <Page logo={this.props.leaseSettings.logo}>
                            <Route path={ROUTES.PROFILE} component={ProfileContainer} />
                            <Route path={ROUTES.LOGIN} component={LoginPage} />
                            <Route path={ROUTES.SIGNUP} component={SignupPage} />
                            <Route path={ROUTES.TOS} component={TermsPage}/>
                        </Page>
                    </Switch>
                </div>
            </AppContextProvider>
        );
    }
}

const mapStateToProps = state => ({
    profile: state.renterProfile,
    leaseSettings: state.leaseSettings
});

const mapDispatchToProps = {fetchRenterProfile, fetchLeaseSettings};


export default connect(mapStateToProps, mapDispatchToProps)(Main);
