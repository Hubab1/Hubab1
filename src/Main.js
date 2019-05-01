import 'assets/emotion/styles';

import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import queryString from 'query-string';

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
import { buildRoute, getInitialPage } from 'utils/routeNavigation';
import { Routes } from 'constants.js';

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
        if (auth.isAuthenticated() && await sessionIsValidForCommunityId(communityId)) {
            this.props.fetchLeaseSettings(communityId).then((leaseSettings) => {
                const primaryColor = leaseSettings.primary_color;
                const secondaryColor = leaseSettings.secondary_color;
                this.setState({theme: createTheme(primaryColor, secondaryColor)});
                this.mountNavigation(true, leaseSettings);
            })
        } else {
            // check if url has query parameter for clients/unit info
            let params = queryString.parse(this.props.location.search);
            this.props.fetchLeaseSettings(communityId, params.v).then((leaseSettings) => {
                const primaryColor = leaseSettings.primary_color;
                const secondaryColor = leaseSettings.secondary_color;
                this.setState({theme: createTheme(primaryColor, secondaryColor)});
                this.mountNavigation(false, leaseSettings);
            })
        }
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
            history.replace(buildRoute(match.url, initialPage));
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
                        <Route path={buildRoute(match.url, Routes.WELCOME)} component={WelcomePage}/>
                        <Page>
                            <Route path={buildRoute(match.url, Routes.PROFILE)} component={ProfileContainer} />
                            <Route path={buildRoute(match.url, Routes.LOGIN)} component={LoginPage} />
                            <Route path={buildRoute(match.url, Routes.SIGNUP)} component={SignupPage} />
                            <Route path={buildRoute(match.url, Routes.TOS)} component={TermsPage}/>
                        </Page>
                    </Switch>
                </div>
            </AppContextProvider>
        );
    }
}

const mapStateToProps = state => ({
    profile: state.renterProfile,
});

const mapDispatchToProps = {fetchRenterProfile, fetchLeaseSettings};


export default connect(mapStateToProps, mapDispatchToProps)(Main);
