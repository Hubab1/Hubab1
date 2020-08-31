import React, { Component } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import { sessionIsValidForCommunityId } from 'utils/misc';
import AppContextProvider from 'contexts/AppContextProvider';
import ResendLinkForm from 'components/common/ResendLinkForm';
import WelcomePage from 'components/welcome/WelcomePage';
import PasswordContainer from 'components/password/PasswordContainer';
import RentalProfileContainer from 'components/profile/RentalProfileContainer';
import LoginPage from 'components/login/LoginPage';
import AccountPage from 'components/account/AccountPage';
import RegisterPage from 'components/RegisterPage';
import LeaseTermsPage from 'components/LeaseTermsPage';
import BankingContainer from 'components/banking/BankingContainer';
import FeesDepositsContainer from 'components/fees-deposits/FeesDepositsContainer';
import HoldingDepositAgreementContainer from 'components/holding-deposit-agreement/HoldingDepositAgreementContainer';
import UnauthenticatedPaymentTerms from 'components/fees-deposits/UnauthenticatedPaymentTerms';
import auth from 'utils/auth';
import { fetchRenterProfile, selectors } from 'reducers/renter-profile';
import { fetchConfiguration } from 'reducers/configuration';
import { fetchApplicant } from 'reducers/applicant';
import { actions as mainActions } from 'reducers/store';
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
import TermsPage from 'components/TermsPage';
import AppCancelled from 'components/AppCancelled';
import LeaseVoided from 'components/LeaseVoided';
import PrivacyPolicy from 'components/PrivacyPolicy';
import UnitUnavailable from 'components/UnitUnavailable';
import CriticalError from 'components/common/CriticalError';

export class Main extends Component {
    state = {error: null};

    mountNavigation(isAuthenticated, configuration) {
        const { fetchRenterProfile, history, location } = this.props;
        const pathname = location.pathname;

        const clientRegistered = configuration.client && configuration.client.applicant_id;
        const inviteeRegistered = configuration.invitee && configuration.invitee.is_registered;
        const hasRegistered = clientRegistered || inviteeRegistered;

        if (!isAuthenticated) {
            if (pathname.includes('login') || pathname.includes('signup') ||
                pathname.includes('password') || pathname.includes('terms') ||
                pathname.includes('privacy-policy')
            ) return;
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
        this.resetTimer();
        this.addIdleEventListeners();
    }

    addIdleEventListeners = () => {
        // assign document events
        ['mousemove', 'touchstart', 'scroll', 'touchend', 'click', 'touchmove', 'keypress'].forEach(eventType => {
            document.addEventListener(eventType, this.resetTimer);
        });

        // assign window events
        ['load', 'scroll'].forEach(eventType => {
            window.addEventListener(eventType, this.resetTimer);
        });
    }

    removeIdleEventListeners = () => {
        ['mousemove', 'touchstart', 'scroll', 'touchend', 'click', 'touchmove', 'keypress'].forEach(eventType => {
            document.removeEventListener(eventType, this.resetTimer);
        });

        // assign window events
        ['load', 'scroll'].forEach(eventType => {
            window.removeEventListener(eventType, this.resetTimer);
        });
    }

    componentWillUnmount () {
        this.removeIdleEventListeners();
    }

    resetTimer = () => {
        clearTimeout(this.time);
        const SECOND = 1000;
        this.time = setTimeout(this.logout, SECOND*60*15);
    }

    logout = () => {
        if (this.props.isLoggedIn) {
            this.props.logout();
            localStorage.clear();
            this.props.history.push({
                pathname: ROUTES.LOGIN,
                state: {errors: 'Oops, your session has timed-out. Please log back in to continue.'}
            });
        }
    }

    render() {
        const { theme, isLoggedIn } = this.props;
        if (this.state.hasError) return <CriticalError/>;
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
                        {!isLoggedIn && <Route path={ROUTES.PRIVACY_POLICY} component={PrivacyPolicy} />}
                        {!isLoggedIn && <Route path={ROUTES.TERMS} component={TermsPage}/>}
                        {isLoggedIn && <NavDrawer>
                            <Route path={ROUTES.LEASE_TERMS} component={LeaseTermsPage} />
                            <Route path={ROUTES.ACCOUNT} component={AccountPage} />
                            <Route path={ROUTES.RENTAL_PROFILE} component={RentalProfileContainer} />
                            <Route path={ROUTES.ADDRESS} component={Address} />
                            <Route path={ROUTES.BANKING} component={BankingContainer}/>
                            <Route path={ROUTES.FEES_AND_DEPOSITS} component={FeesDepositsContainer}/>
                            <Route path={ROUTES.HOLDING_DEPOSIT_AGREEMENT} component={HoldingDepositAgreementContainer} />
                            <Route path={ROUTES.SCREENING} component={SCREENING}/>
                            <Route path={ROUTES.APP_COMPLETE} component={AppComplete}/>
                            <Route path={ROUTES.RESEND_INVITE} component={ResendLinkForm}/>
                            <Route path={ROUTES.APP_APPROVED} component={AppApproved}/>
                            <Route path={ROUTES.LEASE_SIGNED} component={LeaseSigned}/>
                            <Route path={ROUTES.LEASE_EXECUTED} component={LeaseExecuted}/>
                            <Route path={ROUTES.APP_DENIED} component={AppDenied}/>
                            <Route path={ROUTES.APP_CANCELLED} component={AppCancelled}/>
                            <Route path={ROUTES.TERMS} component={TermsPage}/>
                            <Route path={ROUTES.LEASE_VOIDED} component={LeaseVoided} />
                            <Route path={ROUTES.PRIVACY_POLICY} component={PrivacyPolicy} />
                            <Route path={ROUTES.UNIT_UNAVAILABLE} component={UnitUnavailable} />
                        </NavDrawer>}
                    </Switch>
                </div>
            </AppContextProvider>
        );
    }
}

const mapStateToProps = state => ({
    profile: state.renterProfile,
    isLoggedIn: sessionIsValidForCommunityId(state.siteConfig.basename),
    configuration: state.configuration,
    communityId: state.siteConfig.basename,
    hash: state.siteConfig.hash,
    initialPage: selectors.selectInitialPage(state),
    canAccessCurrentRoute: () => selectors.canAccessRoute(state, state.siteConfig.currentRoute),
    theme: configSelectors.selectTheme(state),
});

const mapDispatchToProps = {fetchRenterProfile, fetchConfiguration, fetchApplicant, logout: mainActions.logout};


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Main));
