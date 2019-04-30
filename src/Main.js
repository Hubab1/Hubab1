import 'assets/emotion/styles';

import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import queryString from 'query-string';

import WelcomePage from 'components/welcome/WelcomePage';
import ProfileContainer from 'components/profile/ProfileContainer';
import LoginPage from 'components/login/LoginPage';
import SignupPage from 'components/SignupPage';
import TermsPage from 'components/TermsPage';
import Page from 'components/common/Page/Page';
import history from 'history.js';
import createTheme from 'assets/createTheme';
import auth from 'utils/auth';
import { getInitialPage } from 'utils/initializePage';
import { fetchRenterProfile } from 'reducers/renter-profile';
import { fetchLeaseSettings } from 'reducers/lease-settings';


async function sessionIsValidForCommunityId (community) {
    // do some api call to check that this authentication token is valid for this community
    // eg const isValidSession = await API.checkToken(community, auth.getToken());
    return true;
}

export class Main extends Component {
    state = {theme: null}

    mountNavigation(isAuthenticated, leaseSettings) {
        const { fetchRenterProfile, match } = this.props;
        if (!isAuthenticated) {
            if (leaseSettings.client && leaseSettings.client.application_id) {
                history.push(`${match.url}/login`);
            } else {
                history.push(`${match.url}/welcome`);
            }
        } else {
            fetchRenterProfile();
        }
    }

    componentDidMount () {
        const commId = this.props.match.params.communityId;
        const { fetchLeaseSettings } = this.props;
        if (auth.isAuthenticated() && sessionIsValidForCommunityId(commId)) {
            fetchLeaseSettings(commId).then((leaseSettings) => {
                const primaryColor = leaseSettings.primary_color;
                const secondaryColor = leaseSettings.secondary_color;
                this.setState({theme: createTheme(primaryColor, secondaryColor)});
                this.mountNavigation(true, leaseSettings);
            })
        } else {
            // check if url has query parameter for clients/unit info
            let params = queryString.parse(this.props.location.search);
            fetchLeaseSettings(commId, params.v).then((leaseSettings) => {
                const primaryColor = leaseSettings.primary_color;
                const secondaryColor = leaseSettings.secondary_color;
                this.setState({theme: createTheme(primaryColor, secondaryColor)});
                this.mountNavigation(false, leaseSettings);
            })
        }
    }

    componentDidUpdate (prevProps) {
        // i figured this might be worth handling, but probably should come up with better way to handle this another time
        const communityId = this.props.match.params.communityId;
        if (prevProps.match.params.communityId !== communityId) {
            console.error('Error, changing community is not supported');
            throw new Error();
        }

        if (!prevProps.profile && this.props.profile) {
            const commId = this.props.match.params.communityId;
            const initialPage = getInitialPage(commId, this.props.profile);
            history.push(`/${communityId}/${initialPage}`);
        }
    }

    render() {
        const theme = this.state.theme;
        if (!theme) return null;
        const { match }= this.props;
        const routes = (
            <Switch>
                <Route path={`${match.url}/welcome`} component={WelcomePage}/>
                <Page>
                    <Route path={`${match.url}/profile`} component={ProfileContainer} />
                    <Route path={`${match.url}/login`} component={LoginPage} />
                    <Route path={`${match.url}/signup`} component={SignupPage} />
                    <Route path={`${match.url}/terms`} component={TermsPage}/>
                </Page>
            </Switch>
        );
        return (
            <MuiThemeProvider theme={theme}>
                <div className="App">
                    {routes}
                </div>
            </MuiThemeProvider>
        );
    }
}

const mapStateToProps = state => ({
    profile: state.renterProfile,
});

const mapDispatchToProps = {fetchRenterProfile, fetchLeaseSettings};


export default connect(mapStateToProps, mapDispatchToProps)(Main);
