import React, { Component } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import AppContextProvider from 'contexts/AppContextProvider';
import ResendLinkForm from 'components/common/ResendLinkForm';
import WelcomePage from 'components/welcome/WelcomePage';
import PasswordContainer from 'components/password/PasswordContainer';
import RentalProfileContainer from 'components/profile/RentalProfileContainer';
import LoginPage from 'components/login/LoginPage';
import AccountPage from 'components/account/AccountPage';
import RegisterPage from 'components/RegisterPage';
import LeaseTermsPage from 'components/LeaseTermsPage';
import ConnectBankPage from 'components/banking/ConnectBankPage';
import ManualIncomeEntryPage from 'components/banking/ManualIncomeEntryPage';
import FeesDepositsContainer from 'components/fees-deposits/FeesDepositsContainer';
import UnauthenticatedPaymentTerms from 'components/fees-deposits/UnauthenticatedPaymentTerms';
import auth from 'utils/auth';
import { fetchRenterProfile, selectors } from 'reducers/renter-profile';
import { fetchConfiguration } from 'reducers/configuration';
import { fetchApplicant } from 'reducers/applicant';
import { ROUTES } from 'app/constants';
import { selectors as configSelectors } from 'reducers/configuration';
import Address from 'components/Address';
import SCREENING from 'components/Screening';
import NavDrawer from 'components/NavDrawer';
import AppComplete from 'components/status/AppComplete';
import AppApproved from 'components/AppApproved';
import AppDenied from 'components/AppDenied';
import LeaseSigned from 'components/LeaseSigned';
import LeaseExecuted from 'components/LeaseExecuted';

function sessionIsValidForCommunityId (communityId) {
    if (auth.accessScope() === communityId) {
        // maybe do some api call to check that this authentication token is valid for this community
        // eg const isValidSession = await API.checkToken(community, auth.getToken());
        return true;
    }
    return false;
}

export class Main extends Component {
    state = {error: null};

    mountNavigation(isAuthenticated, configuration) {
        const { fetchRenterProfile, history, location } = this.props;
        const pathname = location.pathname;

        const clientRegistered = configuration.client && configuration.client.applicant_id;
        const inviteeRegistered = configuration.invitee && configuration.invitee.is_registered;
        const hasRegistered = clientRegistered || inviteeRegistered;

        if (!isAuthenticated) {
            if (pathname.includes('login') || pathname.includes('signup') || pathname.includes('password') || pathname.includes('payment-terms')) return;
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
                if (!this.props.canAccessCurrentRoute()) {
                    history.replace(this.props.initialPage);

                }
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
        const { theme, applicant } = this.props;
        const hasApplicant = !!applicant;
        if (this.state.hasError) return <div>Error getting application form</div>;
        if (!theme) return null;
        return (
            <AppContextProvider theme={theme}>
                <div>
                    <Switch>
                        <Route path={ROUTES.WELCOME} component={WelcomePage} />
                        <Route path={ROUTES.LOGIN} component={LoginPage} />
                        <Route path={ROUTES.SIGNUP} component={RegisterPage} />
                        <Route path={ROUTES.PASSWORD} component={PasswordContainer} />
                        <Route path={ROUTES.PAYMENT_TERMS} component={UnauthenticatedPaymentTerms} />
                        {hasApplicant && <NavDrawer name={applicant.client.person.name} email={applicant.client.person.email}>
                            <Route path={ROUTES.LEASE_TERMS} component={LeaseTermsPage} />
                            <Route path={ROUTES.ACCOUNT} component={AccountPage} />
                            <Route path={ROUTES.RENTAL_PROFILE} component={RentalProfileContainer} />
                            <Route path={ROUTES.ADDRESS} component={Address} />
                            <Route path={ROUTES.INCOME_AND_EMPLOYMENT} component={ConnectBankPage}/>
                            <Route path={ROUTES.MANUAL_INCOME_ENTRY} component={ManualIncomeEntryPage}/>
                            <Route path={ROUTES.FEES_AND_DEPOSITS} component={FeesDepositsContainer}/>
                            <Route path={ROUTES.SCREENING} component={SCREENING}/>
                            <Route path={ROUTES.APP_COMPLETE} component={AppComplete}/>
                            <Route path={ROUTES.RESEND_INVITE} component={ResendLinkForm}/>
                            <Route path={ROUTES.APP_APPROVED} component={AppApproved}/>
                            <Route path={ROUTES.LEASE_SIGNED} component={LeaseSigned}/>
                            <Route path={ROUTES.LEASE_EXECUTED} component={LeaseExecuted}/>
                            <Route path={ROUTES.APP_DENIED} component={AppDenied}/>
                        </NavDrawer>}
                    </Switch>
                </div>
            </AppContextProvider>
        );
    }
}

const mapStateToProps = state => ({
    profile: state.renterProfile,
    applicant: state.applicant,
    configuration: state.configuration,
    communityId: state.siteConfig.basename,
    hash: state.siteConfig.hash,
    initialPage: selectors.selectInitialPage(state),
    canAccessCurrentRoute: () => selectors.canAccessRoute(state, state.siteConfig.currentRoute),
    theme: configSelectors.selectTheme(state),
});

const mapDispatchToProps = {fetchRenterProfile, fetchConfiguration, fetchApplicant};


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Main));
