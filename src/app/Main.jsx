import React, { Component } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import AppContextProvider from 'contexts/AppContextProvider';
import WelcomePage from 'components/welcome/WelcomePage';
import PasswordContainer from 'components/password/PasswordContainer';
import ProfileContainer from 'components/profile/ProfileContainer';
import LoginPage from 'components/login/LoginPage';
import SignupPage from 'components/SignupPage';
import ConnectBankPage from 'components/banking/ConnectBankPage';
import ManualIncomeEntryPage from 'components/banking/ManualIncomeEntryPage';
import ApplicationFeePage from 'components/ApplicationFeePage/ApplicationFeePage';
import auth from 'utils/auth';
import { fetchRenterProfile, selectors } from 'reducers/renter-profile';
import { fetchConfiguration } from 'reducers/configuration';
import { fetchApplicant } from 'reducers/applicant';
import { ROUTES } from 'app/constants';
import { selectors as configSelectors } from 'reducers/configuration';
import TellUsMore from 'components/TellUsMorePage';
import FinalDetails from 'components/FinalDetails';
import NavDrawer from 'components/NavDrawer';
import AppStatusPage from 'components/status/AppStatusPage';

function sessionIsValidForCommunityId (communityId) {
    if (auth.accessScope() === communityId) {
        // maybe do some api call to check that this authentication token is valid for this community
        // eg const isValidSession = await API.checkToken(community, auth.getToken());
        return true;
    }
    return false;
}

export class Main extends Component {
    state = {error: null}

    mountNavigation(isAuthenticated, configuration) {
        const { fetchRenterProfile, history, location } = this.props;
        const pathname = location.pathname;

        const clientRegistered = configuration.client && configuration.client.applicant_id;
        const inviteeRegistered = configuration.invitee && configuration.invitee.is_registered;
        const hasRegistered = clientRegistered || inviteeRegistered;

        if (!isAuthenticated) {
            if (pathname.includes('login') || pathname.includes('signup') || pathname.includes('password')) return;
            if (!configuration.client || !configuration.invitee) {
                history.replace(ROUTES.WELCOME);
            }
            else if (hasRegistered) {
                history.replace(ROUTES.LOGIN);
            } else {
                history.replace(ROUTES.WELCOME);
            }   
        } else {
            fetchRenterProfile().then(() => {
                history.replace(this.props.initialPage);
            });
        }
    }

    async componentDidMount () {
        const communityId = this.props.communityId;
        const hash = this.props.hash;
        const isLoggedIn = auth.isAuthenticated() && sessionIsValidForCommunityId(communityId);

        let configuration;
        try {
            configuration = await this.props.fetchConfiguration(communityId, hash);
            isLoggedIn && await this.props.fetchApplicant();
        } catch {
            // todo: handle community id not found better.
            return this.setState({hasError: true});
        }

        this.mountNavigation(isLoggedIn, configuration);
    }

    render() {
        const theme = this.props.theme;
        if (this.state.hasError) return <div>Error getting application form</div>;
        if (!theme) return null;
        return (
            <AppContextProvider theme={theme}>
                <div>
                    <Switch>
                        <Route path={ROUTES.WELCOME} component={WelcomePage} />
                        <Route path={ROUTES.LOGIN} component={LoginPage} />
                        <Route path={ROUTES.SIGNUP} component={SignupPage} />
                        <Route path={ROUTES.PASSWORD} component={PasswordContainer} />
                        <NavDrawer hideNav={!this.props.configuration.show_navigation}>
                            <Route path={ROUTES.PROFILE} component={ProfileContainer} />
                            <Route path={ROUTES.TELL_US_MORE} component={TellUsMore} />
                            <Route path={ROUTES.CONNECT_BANK} component={ConnectBankPage}/>
                            <Route path={ROUTES.MANUAL_INCOME_ENTRY} component={ManualIncomeEntryPage}/>
                            <Route path={ROUTES.APPLICATION_FEE} component={ApplicationFeePage}/>
                            <Route path={ROUTES.FINAL_DETAILS} component={FinalDetails}/>
                            <Route path={ROUTES.APP_STATUS} component={AppStatusPage}/>
                        </NavDrawer>
                    </Switch>
                </div>
            </AppContextProvider>
        );
    }
}

const mapStateToProps = state => ({
    profile: state.renterProfile,
    configuration: state.configuration,
    communityId: state.siteConfig.basename,
    hash: state.siteConfig.hash,
    initialPage: selectors.selectInitialPage(state),
    theme: configSelectors.selectTheme(state),
});

const mapDispatchToProps = {fetchRenterProfile, fetchConfiguration, fetchApplicant};


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Main));
