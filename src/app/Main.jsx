import React, { Component } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import queryString from 'query-string';

import AppContextProvider from 'contexts/AppContextProvider';
import WelcomePage from 'components/welcome/WelcomePage';
import ProfileContainer from 'components/profile/ProfileContainer';
import LoginPage from 'components/login/LoginPage';
import SignupPage from 'components/SignupPage';
import TermsPage from 'components/TermsPage';
import ForgotPasswordPage from 'components/ForgotPasswordPage';
import Page from 'components/common/Page/Page';
import createTheme from 'assets/createTheme';
import auth from 'utils/auth';
import { fetchRenterProfile } from 'reducers/renter-profile';
import { fetchConfiguration } from 'reducers/configuration';
import { getInitialPage } from 'utils/routeNavigation';
import { ROUTES } from 'app/constants';

async function sessionIsValidForCommunityId (communityId) {
    if (auth.accessScope() === communityId) {
        // maybe do some api call to check that this authentication token is valid for this community
        // eg const isValidSession = await API.checkToken(community, auth.getToken());
        return true;
    }
    return false;
}

export class Main extends Component {
    state = {theme: null, error: null}

    mountNavigation(isAuthenticated, configuration) {
        const { fetchRenterProfile, history, location } = this.props;
        if (!isAuthenticated) {
            if (location.pathname.includes('login') || location.pathname.includes('signup')) return;
            if (!configuration.client) {
                history.replace(ROUTES.WELCOME);
            }
            else if (configuration.client && configuration.client.application_id) {
                history.replace(ROUTES.LOGIN);
            } else {
                history.replace(ROUTES.WELCOME);
            }
        } else {
            fetchRenterProfile();
        }
    }

    async componentDidMount () {
        const communityId = this.props.communityId;
        const isLoggedIn = auth.isAuthenticated() && await sessionIsValidForCommunityId(communityId);

        let params = queryString.parse(this.props.location.search);
        let configuration;
        try {
            configuration = await this.props.fetchConfiguration(communityId, params.v);
        } catch {
            // todo: handle community id not found better.
            return this.setState({hasError: true});
        }
        const primaryColor = configuration.primary_color;
        const secondaryColor = configuration.secondary_color;
        // todo: store in redux
        this.setState({theme: createTheme(primaryColor, secondaryColor)});

        this.mountNavigation(isLoggedIn, configuration);
    }

    componentDidUpdate (prevProps) {
        const { history } = this.props;

        if (!prevProps.profile && this.props.profile) {
            const initialPage = getInitialPage(this.props.profile);
            history.replace(initialPage);
        }
    }

    render() {
        const theme = this.state.theme;
        if (this.state.hasError) return <div>Error getting application form</div>;
        if (!theme) return null;
        return (
            <AppContextProvider theme={theme}>
                <div>
                    <Switch>
                        <Route path={ROUTES.WELCOME} component={WelcomePage}/>
                        <Page>
                            <Route path={ROUTES.PROFILE} component={ProfileContainer} />
                            <Route path={ROUTES.LOGIN} component={LoginPage} />
                            <Route path={ROUTES.SIGNUP} component={SignupPage} />
                            <Route path={ROUTES.TOS} component={TermsPage}/>
                            <Route path={ROUTES.FORGOT_PASSWORD} component={ForgotPasswordPage} />
                        </Page>
                    </Switch>
                </div>
            </AppContextProvider>
        );
    }
}

const mapStateToProps = state => ({
    profile: state.renterProfile,
    configuration: state.configuration,
    communityId: state.siteConfig.basename
});

const mapDispatchToProps = {fetchRenterProfile, fetchConfiguration};


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Main));
